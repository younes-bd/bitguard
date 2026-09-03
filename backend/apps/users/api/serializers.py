from rest_framework import serializers
from ..domain.models import User, Role, SecurityPolicy, RolePermission, RecordRule
from django.contrib.contenttypes.models import ContentType
from apps.core.domain.models import Partner

class RoleSerializer(serializers.ModelSerializer):
    user_count = serializers.IntegerField(read_only=True, required=False)
    permissions_count = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'parent', 'permissions', 'user_count', 'permissions_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

    def get_permissions_count(self, obj):
        return len(obj.permissions) if isinstance(obj.permissions, list) else 0

class RolePermissionSerializer(serializers.ModelSerializer):
    model_name = serializers.CharField(source='content_type.model', read_only=True)
    app_label = serializers.CharField(source='content_type.app_label', read_only=True)
    
    class Meta:
        model = RolePermission
        fields = ['id', 'role', 'content_type', 'model_name', 'app_label', 'can_read', 'can_write', 'can_create', 'can_delete']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class ContentTypeSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentType
        fields = ['id', 'app_label', 'model', 'label']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        
    def get_label(self, obj):
        return obj.model.replace('_', ' ').title()


class PartnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['id', 'name', 'bio', 'date_of_birth', 'gender', 'city', 'country', 'language', 'image', 'phone', 'address']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class UserSerializer(serializers.ModelSerializer):
    partner = PartnerProfileSerializer(read_only=True)
    roles = RoleSerializer(many=True, read_only=True)
    tenant_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    contact_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    role_ids = serializers.ListField(child=serializers.UUIDField(), write_only=True, required=False)
    manager_name = serializers.SerializerMethodField()
    memberships = serializers.SerializerMethodField()
    tenants = serializers.SerializerMethodField()
    tenant = serializers.SerializerMethodField()
    avatar = serializers.ImageField(source='partner.image', read_only=True)
    phone_number = serializers.CharField(source='partner.phone', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'phone_number', 'is_verified', 'is_active', 'is_staff', 'is_superuser',
            'mfa_enabled', 'is_locked', 'last_login_ip',
            'tenant', 'tenant_id', 'contact_id', 'roles', 'role_ids', 'partner', 'date_joined', 'memberships', 'tenants',
            'user_type', 'must_change_password', 'manager', 'manager_name', 'avatar'
        ]
        read_only_fields = ['id', 'date_joined', 'tenant', 'mfa_enabled', 'is_locked', 'last_login_ip', 'memberships', 'tenants', 'manager_name']

    def get_tenants(self, obj):
        return self.get_memberships(obj)

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}".strip() or obj.manager.email
        return None

    def get_memberships(self, obj):
        from apps.users.domain.models import TenantMembership
        from apps.tenants.domain.models import Tenant
        request = self.context.get('request')
        if getattr(obj, 'is_superuser', False):
            tenants = Tenant.objects.all()
            return [
                {
                    'id': t.id,
                    'name': t.name,
                    'domain': getattr(t, 'domain', None),
                    'role': 'SUPER_ADMIN',
                    'bundle': getattr(t, 'bundle', None),
                    'logo': request.build_absolute_uri(t.logo.url) if t.logo and hasattr(request, 'build_absolute_uri') else (t.logo.url if t.logo else None)
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
                'bundle': getattr(m.tenant, 'bundle', None),
                'logo': request.build_absolute_uri(m.tenant.logo.url) if m.tenant.logo and hasattr(request, 'build_absolute_uri') else (m.tenant.logo.url if m.tenant.logo else None)
            }
            for m in memberships
        ]

    def get_tenant(self, obj):
        request = self.context.get('request')
        if hasattr(obj, 'tenant') and obj.tenant:
            return {
                'id': obj.tenant.id,
                'name': obj.tenant.name,
                'domain': getattr(obj.tenant, 'domain', None),
                'logo': request.build_absolute_uri(obj.tenant.logo.url) if obj.tenant.logo and hasattr(request, 'build_absolute_uri') else (obj.tenant.logo.url if obj.tenant.logo else None)
            }
        return None

    def create(self, validated_data):
        role_ids = validated_data.pop('role_ids', [])
        tenant_id = validated_data.pop('tenant_id', None)
        tenant_obj = validated_data.pop('tenant', None)
        contact_id = validated_data.pop('contact_id', None)
        
        # Extract phone and avatar from initial_data if provided by frontend
        phone_val = self.initial_data.get('phone_number', '')
        
        user = User.objects.create_user(**validated_data)
        
        if tenant_obj:
            from apps.users.domain.models import TenantMembership
            TenantMembership.objects.create(user=user, tenant=tenant_obj)
        
        if role_ids:
            roles = Role.objects.filter(id__in=role_ids)
            user.roles.set(roles)
            
        if contact_id:
            from apps.crm.domain.models import Contact
            Contact.objects.filter(id=contact_id).update(user=user)
            
        partner = Partner.objects.create(
            name=f"{user.first_name} {user.last_name}".strip() or user.username,
            email=user.email,
            phone=phone_val
        )
        user.partner = partner
        user.save()
        return user

    def update(self, instance, validated_data):
        role_ids = validated_data.pop('role_ids', None)
        tenant_id = validated_data.pop('tenant_id', None)
        tenant_obj = validated_data.pop('tenant', None)
        contact_id = validated_data.pop('contact_id', None)
            
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
        fields = ['id', 'tenant', 'password_complexity', 'session_timeout', 'mfa_required', 'api_key_rotation', 'ip_whitelist', 'failed_login_lock', 'lock_duration', 'concurrent_sessions']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class RecordRuleSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name', read_only=True)
    model_label = serializers.SerializerMethodField()
    
    def get_model_label(self, obj):
        return f"{obj.content_type.app_label}.{obj.content_type.model}"
    
    class Meta:
        model = RecordRule
        fields = ['id', 'name', 'role', 'role_name', 'content_type', 'model_label', 
                  'domain_filter', 'is_global', 'created_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

