from rest_framework import serializers
from .models import User, Role, UserProfile, SecurityPolicy

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'parent', 'permissions']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'bio', 'date_of_birth', 'gender', 'city', 'country', 'language']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    roles = RoleSerializer(many=True, read_only=True)
    role_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'phone_number', 'is_verified', 'is_active', 'is_staff', 'is_superuser',
            'mfa_enabled', 'is_locked', 'last_login_ip',
            'tenant', 'roles', 'role_ids', 'profile', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'tenant', 'mfa_enabled', 'is_locked', 'last_login_ip']

    def create(self, validated_data):
        role_ids = validated_data.pop('role_ids', [])
        user = User.objects.create_user(**validated_data)
        if role_ids:
            roles = Role.objects.filter(id__in=role_ids)
            user.roles.set(roles)
        UserProfile.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        role_ids = validated_data.pop('role_ids', None)
        if role_ids is not None:
            roles = Role.objects.filter(id__in=role_ids)
            instance.roles.set(roles)
        return super().update(instance, validated_data)

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class SecurityPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityPolicy
        fields = '__all__'
