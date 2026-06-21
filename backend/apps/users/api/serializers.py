from rest_framework import serializers
from ..domain.models import User, Role, UserProfile, SecurityPolicy

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
    tenant_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    contact_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    role_ids = serializers.ListField(child=serializers.UUIDField(), write_only=True, required=False)
    memberships = serializers.SerializerMethodField()
    tenant = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'phone_number', 'is_verified', 'is_active', 'is_staff', 'is_superuser',
            'mfa_enabled', 'is_locked', 'last_login_ip',
            'tenant', 'tenant_id', 'contact_id', 'roles', 'role_ids', 'profile', 'date_joined', 'memberships'
        ]
        read_only_fields = ['id', 'date_joined', 'tenant', 'mfa_enabled', 'is_locked', 'last_login_ip', 'memberships']

    def get_memberships(self, obj):
        from apps.users.models import TenantMembership
        from apps.tenants.models import Tenant
        
        if getattr(obj, 'is_superuser', False):
            tenants = Tenant.objects.all()
            return [
                {
                    'id': t.id,
                    'name': t.name,
                    'domain': getattr(t, 'domain', None),
                    'role': 'SUPER_ADMIN',
                    'bundle': getattr(t, 'bundle', None)
                }
                for t in tenants
            ]

        memberships = TenantMembership.objects.filter(user=obj, is_active=True).select_related('tenant')
        return [
            {
                'id': m.tenant.id,
                'name': m.tenant.name,
                'domain': m.tenant.domain,
                'role': None,
                'bundle': getattr(m.tenant, 'bundle', None)
            }
            for m in memberships
        ]

    def get_tenant(self, obj):
        if hasattr(obj, 'tenant') and obj.tenant:
            return {
                'id': obj.tenant.id,
                'name': obj.tenant.name,
                'domain': getattr(obj.tenant, 'domain', None)
            }
        return None

    def create(self, validated_data):
        role_ids = validated_data.pop('role_ids', [])
        tenant_id = validated_data.pop('tenant_id', None)
        contact_id = validated_data.pop('contact_id', None)
        
        if tenant_id:
            validated_data['tenant_id'] = tenant_id
            
        user = User.objects.create_user(**validated_data)
        
        if role_ids:
            roles = Role.objects.filter(id__in=role_ids)
            user.roles.set(roles)
            
        if contact_id:
            from apps.crm.domain.models import Contact
            Contact.objects.filter(id=contact_id).update(user=user)
            
        UserProfile.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        role_ids = validated_data.pop('role_ids', None)
        tenant_id = validated_data.pop('tenant_id', None)
        contact_id = validated_data.pop('contact_id', None)
        
        if tenant_id is not None:
            instance.tenant_id = tenant_id
            
        if role_ids is not None:
            roles = Role.objects.filter(id__in=role_ids)
            instance.roles.set(roles)
            
        if contact_id is not None:
            from apps.crm.domain.models import Contact
            # Clear previous contact link if any
            Contact.objects.filter(user=instance).update(user=None)
            if contact_id: # If an actual ID is provided (not null/empty)
                Contact.objects.filter(id=contact_id).update(user=instance)
                
        return super().update(instance, validated_data)

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class SecurityPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityPolicy
        fields = '__all__'
