import sys
import re

service_file = r"c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps\users\application\services.py"
view_file = r"c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps\users\api\views.py"

with open(service_file, 'r') as f:
    content = f.read()

new_methods = """
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
        return True, f'Invitation sent to {email}', user

    @classmethod
    def send_password_reset(cls, request, user):
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        from django.core.mail import send_mail
        from django.conf import settings
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/auth/set-password/{uid}/{token}/"
        
        send_mail(
            subject="Password Reset Request",
            message=f"Click here to reset your password: {reset_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        return True

    @classmethod
    def resend_invitation(cls, request, user):
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        from django.core.mail import send_mail
        from django.conf import settings
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        invite_url = f"{settings.FRONTEND_URL}/auth/set-password/{uid}/{token}/"
        
        tenant_name = getattr(user, 'tenant', None)
        tenant_name = tenant_name.name if tenant_name else 'our platform'

        send_mail(
            subject=f"You've been invited to {tenant_name}",
            message=f"Click here to set your password and activate your account: {invite_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        return True
"""

if "def invite_user" not in content:
    content = content.replace("def create_connection(cls, request, from_user, to_user_email):", new_methods + "\n    @classmethod\n    def create_connection(cls, request, from_user, to_user_email):")
    with open(service_file, 'w') as f:
        f.write(content)


with open(view_file, 'r') as f:
    view_content = f.read()

invite_regex = re.compile(r"(@action\(detail=False, methods=\['post'\], permission_classes=\[IsAdminUser\]\)\s*def invite\(self, request\):).*?(return Response\({'detail': f'Invitation sent to \{email\}', 'user_id': str\(user\.id\)}, status=201\))", re.DOTALL)
new_invite = """@action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def invite(self, request):
        from ..application.services import IdentityService
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required'}, status=400)
            
        success, msg, user = IdentityService.invite_user(
            request, email, 
            request.data.get('first_name', ''), 
            request.data.get('last_name', ''), 
            request.data.get('role_ids', []), 
            request.data.get('user_type', 'internal')
        )
        if not success:
            return Response({'detail': msg}, status=400)
        return Response({'detail': msg, 'user_id': str(user.id)}, status=201)"""
view_content = invite_regex.sub(new_invite, view_content)

reset_regex = re.compile(r"(@action\(detail=True, methods=\['post'\], permission_classes=\[IsAdminUser\]\)\s*def reset_password\(self, request, pk=None\):).*?(return Response\({'detail': f'Reset link sent to \{user\.email\}'\}\))", re.DOTALL)
new_reset = """@action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reset_password(self, request, pk=None):
        from ..application.services import IdentityService
        user = self.get_object()
        IdentityService.send_password_reset(request, user)
        return Response({'detail': f'Reset link sent to {user.email}'})"""
view_content = reset_regex.sub(new_reset, view_content)

resend_regex = re.compile(r"(@action\(detail=False, methods=\['post'\], url_path='invitations/\(\?P<invitation_id>\[\^/\.\]\+\)/resend', permission_classes=\[IsAdminUser\]\)\s*def resend_invitation\(self, request, invitation_id=None\):).*?(return Response\({'detail': f'Invitation resent to \{user\.email\}'\}\))", re.DOTALL)
new_resend = """@action(detail=False, methods=['post'], url_path='invitations/(?P<invitation_id>[^/.]+)/resend', permission_classes=[IsAdminUser])
    def resend_invitation(self, request, invitation_id=None):
        from django.shortcuts import get_object_or_404
        from ..application.services import IdentityService
        user = get_object_or_404(User, pk=invitation_id)
        IdentityService.resend_invitation(request, user)
        return Response({'detail': f'Invitation resent to {user.email}'})"""
view_content = resend_regex.sub(new_resend, view_content)

with open(view_file, 'w') as f:
    f.write(view_content)

print("done")
