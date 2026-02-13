import random
import string
import hashlib
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.core.mail import send_mail
from .models import OTP, Device, LoginActivity

class OTPService:
    @staticmethod
    def generate_otp(user, type='2fa'):
        # Invalidate existing OTPs
        OTP.objects.filter(user=user, type=type, is_used=False).update(is_used=True)
        
        # Generate new code
        code = ''.join(random.choices(string.digits, k=6))
        expires_at = timezone.now() + timezone.timedelta(minutes=10)
        
        otp = OTP.objects.create(
            user=user,
            code=code,
            type=type,
            expires_at=expires_at
        )
        return code

    @staticmethod
    def verify_otp(user, code, type='2fa'):
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
            return True
        except OTP.DoesNotExist:
            return False

class EmailService:
    @staticmethod
    def send_otp_email(user, code):
        subject = f"Your Verification Code: {code}"
        message = f"Hello {user.username},\n\nYour verification code is: {code}\n\nIt expires in 10 minutes.\n\n- BitGuard Security"
        from_email = settings.EMAIL_HOST_USER
        
        try:
            send_mail(subject, message, from_email, [user.email])
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

class DeviceService:
    @staticmethod
    def track_device(user, request):
        user_agent = request.META.get('HTTP_USER_AGENT', 'unknown')
        ip = DeviceService.get_client_ip(request)
        
        # Simple fingerprint: Hash of IP + UserAgent
        fingerprint_raw = f"{ip}|{user_agent}"
        fingerprint = hashlib.sha256(fingerprint_raw.encode()).hexdigest()
        
        device, created = Device.objects.get_or_create(
            user=user,
            fingerprint=fingerprint,
            defaults={'name': f"Device {ip}", 'is_trusted': False}
        )
        
        # Debounce updates to avoid excessive DB writes (e.g., only update every 5 minutes)
        if not created:
            now = timezone.now()
            if device.last_login < now - timedelta(minutes=5):
                device.last_login = now
                device.save()
            
        return device

    @staticmethod
    def track_login(user, request, status='success'):
        LoginActivity.objects.create(
            user=user,
            ip_address=DeviceService.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', 'unknown')[:200], # Truncate if too long
            status=status
        )

    @staticmethod
    def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService

class IdentityService(BaseService):
    @staticmethod
    def change_password(user, old_password, new_password, request=None):
        """
        Changes a user's password after verification. 
        Updates profile timestamp and logs the security event.
        """
        if not user.check_password(old_password):
            return False, {"old_password": ["Wrong password."]}
            
        user.set_password(new_password)
        user.save()
        
        # Update last changed timestamp
        if hasattr(user, 'profile'):
            user.profile.password_last_changed = timezone.now()
            user.profile.save()
            
        # Log Security Action
        if request:
            AuditService.log(
                request, 
                action="PASSWORD_CHANGED", 
                resource=f"accounts.User:{user.id}",
                payload={"ip": request.META.get('REMOTE_ADDR')}
            )
            
        return True, {"message": "Password updated successfully"}

    @staticmethod
    def update_profile(user, data, request=None):
        """
        Updates a user profile. Ensures traceability and validates data.
        """
        from .models import Profile
        profile, created = Profile.objects.get_or_create(user=user)
        # In a real enterprise app, we'd use a dedicated serializer or form here
        # For now, we update fields explicitly to ensure control
        for attr, value in data.items():
            if hasattr(profile, attr):
                setattr(profile, attr, value)
        profile.save()
        
        # Log Action
        if request:
            AuditService.log(
                request, 
                action="PROFILE_UPDATE", 
                resource=f"accounts.Profile:{profile.id}",
                payload={"fields_updated": list(data.keys())}
            )
            
        return profile

    @staticmethod
    def create_connection(from_user, to_user_email, request=None):
        """
        Initiates a connection request between users.
        """
        from django.contrib.auth import get_user_model
        from .models import Connection
        from django.db.models import Q
        
        User = get_user_model()
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
            from_user=from_user,
            to_user=to_user,
            status='pending'
        )
        
        # Log Action
        if request:
            AuditService.log(
                request, 
                action="CONNECTION_REQUESTED", 
                resource=f"accounts.Connection:{connection.id}",
                payload={"to_user_email": to_user_email}
            )
            
        return connection
