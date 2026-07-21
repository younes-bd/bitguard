from rest_framework import serializers
from ..domain.models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    user_count = serializers.IntegerField(read_only=True, required=False)

    partner_id = serializers.UUIDField(source='partner.id', read_only=True)
    
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'domain', 'subscription_plan', 'is_active', 'status', 'user_count', 'allowed_modules', 'partner', 'partner_id', 'created_at', 'logo']
        read_only_fields = ['id', 'created_at', 'status', 'user_count', 'partner_id']

    def get_status(self, obj):
        return 'active' if obj.is_active else 'suspended'

