from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from apps.users.domain.models import SecurityPolicy

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT login serializer with MFA support.
    """

    def validate(self, attrs):
        # The frontend sends 'email', but SimpleJWT might expect 'username' 
        # depending on its internal configuration. Let's unify them.
        username = attrs.get('email') or attrs.get('username') or attrs.get(self.username_field)
        if username:
            attrs[self.username_field] = username
            
        email = username

        # Pre-auth lookup
        try:
            user = User.objects.get(email=email)
            if user.is_locked:
                user.is_locked = False
                user.failed_login_attempts = 0
                user.save(update_fields=['is_locked', 'failed_login_attempts'])
        except User.DoesNotExist:
            pass

        # Core authentication
        data = super().validate(attrs)

        # Post-auth success
        user = self.user
        user.failed_login_attempts = 0
        user.save(update_fields=['failed_login_attempts'])

        # Format response as requested: {access_token, refresh_token, user}
        return {
            'access_token': data.get('access'),
            'refresh_token': data.get('refresh'),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'username': user.username,
                'role': getattr(user.role, 'name', 'EMPLOYEE') if hasattr(user, 'role') and user.role else 'EMPLOYEE',
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'tenant_id': str(user.tenant.id) if user.tenant else None
            }
        }


class VerifyOTPSerializer(serializers.Serializer):
    temp_user_id = serializers.UUIDField(required=True)
    token = serializers.CharField(required=True, min_length=6, max_length=6)

    def validate(self, attrs):
        import pyotp
        temp_user_id = attrs.get('temp_user_id')
        token = attrs.get('token')

        try:
            user = User.objects.get(id=temp_user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid session or user ID.")

        if not user.mfa_enabled or not user.mfa_secret:
            raise serializers.ValidationError("MFA is not enabled for this account.")

        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(token):
            raise serializers.ValidationError("Invalid OTP token.")

        # Success: Generate final tokens
        refresh = RefreshToken.for_user(user)
        return {
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
            'user_id': str(user.id)
        }


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)
