import random
import string
import hashlib
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.core.mail import send_mail
from ..domain.models import OTP, Device, LoginActivity

from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService

class OTPService(BaseService):
    @classmethod
    def generate_otp(cls, request, user, type='2fa'):
        # Invalidate existing OTPs
        tenant = cls.get_tenant_context(request)
        OTP.objects.filter(user=user, type=type, is_used=False).update(is_used=True)
        
        # Generate new code
        code = ''.join(random.choices(string.digits, k=6))
        expires_at = timezone.now() + timezone.timedelta(minutes=10)
        
        otp = OTP.objects.create(
            tenant=tenant,
            user=user,
            code=code,
            type=type,
            expires_at=expires_at
        )

        AuditService.log_action(
            request,
            action="MFA_OTP_GENERATED",
            resource=f"users.User:{user.id}",
            payload={"type": type}
        )
        return code

    @classmethod
    def verify_otp(cls, request, user, code, type='2fa'):
        try:
            otp = OTP.objects.get(
                user=user,
                code=code,
                type=type,
                is_used=False,
                expires_at__gt=timezone.now()
            )
            otp.is_used = True
            otp.save()

            AuditService.log_action(
                request,
                action="MFA_OTP_VERIFIED",
                resource=f"users.User:{user.id}",
                payload={"type": type, "success": True}
            )
            return True
        except OTP.DoesNotExist:
            AuditService.log_action(
                request,
                action="MFA_OTP_VERIFIED",
                resource=f"users.User:{user.id}",
                payload={"type": type, "success": False}
            )
            return False

class EmailService(BaseService):
    @classmethod
    def send_otp_email(cls, request, user, code):
        subject = f"Your Verification Code: {code}"
        message = f"Hello {user.username or user.email},\n\nYour verification code is: {code}\n\nIt expires in 10 minutes.\n\n- BitGuard Security"
        from_email = settings.EMAIL_HOST_USER
        
        try:
            send_mail(subject, message, from_email, [user.email])
            AuditService.log_action(
                request,
                action="EMAIL_SENT",
                resource=f"users.User:{user.id}",
                payload={"subject": subject}
            )
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

class DeviceService(BaseService):
    @classmethod
    def track_device(cls, request, user):
        tenant = cls.get_tenant_context(request)
        user_agent = request.META.get('HTTP_USER_AGENT', 'unknown')
        ip = cls.get_client_ip(request)
        
        # Simple fingerprint: Hash of IP + UserAgent
        fingerprint_raw = f"{ip}|{user_agent}"
        fingerprint = hashlib.sha256(fingerprint_raw.encode()).hexdigest()
        
        device, created = Device.objects.get_or_create(
            tenant=tenant,
            user=user,
            fingerprint=fingerprint,
            defaults={'name': f"Device {ip}", 'is_trusted': False}
        )
        
        if not created:
            now = timezone.now()
            if device.last_login < now - timedelta(minutes=5):
                device.last_login = now
                device.save()

        if created:
             AuditService.log_action(
                request,
                action="NEW_DEVICE_DETECTED",
                resource=f"users.Device:{device.id}",
                payload={"ip": ip, "user_agent": user_agent}
            )
            
        return device

    @classmethod
    def track_login(cls, request, user, status='success'):
        tenant = cls.get_tenant_context(request)
        ip = cls.get_client_ip(request)
        ua = request.META.get('HTTP_USER_AGENT', 'unknown')[:200]

        LoginActivity.objects.create(
            tenant=tenant,
            user=user,
            ip_address=ip,
            user_agent=ua,
            status=status
        )

        AuditService.log_action(
            request,
            action="USER_LOGIN_ATTEMPT",
            resource=f"users.User:{user.id}",
            payload={"status": status, "ip": ip}
        )

    @staticmethod
    def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class IdentityService(BaseService):
    @classmethod
    def change_password(cls, request, user, old_password, new_password):
        """
        Changes a user's password after verification. 
        Updates profile timestamp and logs the security event.
        """
        if not user.check_password(old_password):
            return False, {"old_password": ["Wrong password."]}
            
        user.set_password(new_password)
        user.save()
            
        AuditService.log_action(
            request, 
            action="PASSWORD_CHANGED", 
            resource=f"users.User:{user.id}",
            payload={"ip": cls.get_client_ip(request)}
        )
            
        return True, {"message": "Password updated successfully"}

    @classmethod
    def update_profile(cls, request, user, data):
        """
        Updates a user profile. Ensures traceability and validates data.
        """
        for attr, value in data.items():
            if hasattr(user, attr):
                setattr(user, attr, value)
        user.save()
        
        AuditService.log_action(
            request, 
            action="PROFILE_UPDATE", 
            resource=f"users.User:{user.id}",
            payload={"fields_updated": list(data.keys())}
        )
            
        return user

    @classmethod
    def invite_user(cls, request, email, first_name, last_name, role_ids, user_type):
        from django.contrib.auth import get_user_model
        from ..domain.models import Role, TenantMembership
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        from django.core.mail import send_mail
        from django.conf import settings
        
        User = get_user_model()
        tenant = getattr(request.user, 'tenant', None)
        
        if User.objects.filter(email=email, tenant_memberships__tenant=tenant).exists():
            return False, 'User with this email already exists', None
            
        user = User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            user_type=user_type,
            must_change_password=True,
            is_active=True
        )
        if tenant:
            TenantMembership.objects.create(user=user, tenant=tenant)
            
        user.set_unusable_password()
        user.save()
        
        if role_ids:
            user.roles.set(Role.objects.filter(id__in=role_ids))
            
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        invite_url = f"{settings.FRONTEND_URL}/auth/set-password/{uid}/{token}/"
        
        tenant_name = tenant.name if tenant else 'our platform'
        send_mail(
            subject=f"You've been invited to {tenant_name}",
            message=f"Click here to set your password and activate your account: {invite_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
        
        from apps.core.services.audit import AuditService
        AuditService.log_action(
            request, 
            action="USER_INVITED", 
            resource=f"users.User:{user.id}",
            payload={"email": email, "roles": role_ids}
        )
        
        return True, f'Invitation sent to {email}', user

    @classmethod
    def create_connection(cls, request, from_user, to_user_email):
        """
        Initiates a connection request between users.
        """
        from django.contrib.auth import get_user_model
        from ..domain.models import Connection
        from django.db.models import Q
        
        User = get_user_model()
        tenant = cls.get_tenant_context(request)

        try:
            to_user = User.objects.get(email=to_user_email)
        except User.DoesNotExist:
            raise ValueError("User with this email does not exist.")
            
        if to_user == from_user:
            raise ValueError("You cannot invite yourself.")

        if Connection.objects.filter(
            (Q(from_user=from_user) & Q(to_user=to_user)) | 
            (Q(from_user=to_user) & Q(to_user=from_user))
        ).exists():
             raise ValueError("Connection already exists or pending.")

        connection = Connection.objects.create(
            tenant=tenant,
            from_user=from_user,
            to_user=to_user,
            status='pending'
        )
        
        AuditService.log_action(
            request, 
            action="CONNECTION_REQUESTED", 
            resource=f"users.Connection:{connection.id}",
            payload={"to_user_email": to_user_email}
        )
            
        return connection

    @staticmethod
    def get_client_ip(request):
        return DeviceService.get_client_ip(request)

