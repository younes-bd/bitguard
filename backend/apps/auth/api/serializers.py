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

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        role = user.roles.first()
        token['role'] = role.name if role else 'EMPLOYEE'
        token['roles'] = list(user.roles.values_list('name', flat=True))
        return token

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

        role = user.roles.first()
        role_name = role.name if role else 'EMPLOYEE'

        # Format response as requested: {access_token, refresh_token, user}
        return {
            'access_token': data.get('access'),
            'refresh_token': data.get('refresh'),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'username': user.username,
                'role': role_name,
                'roles': list(user.roles.values_list('name', flat=True)),
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'tenant_id': str(user.tenant.id) if getattr(user, 'tenant', None) else None
            }
        }


class VerifyOTPSerializer(serializers.Serializer):
    temp_user_id = serializers.UUIDField(required=True)
    token = serializers.CharField(required=True, min_length=6, max_length=6)

    def validate(self, attrs):
        temp_user_id = attrs.get('temp_user_id')
        token = attrs.get('token')

        try:
            user = User.objects.get(id=temp_user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid session or user ID.")

        from apps.auth.services import AuthService
        try:
            return AuthService.verify_otp(user, token)
        except ValueError as e:
            raise serializers.ValidationError(str(e))



class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)
