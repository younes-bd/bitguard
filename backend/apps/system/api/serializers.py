from rest_framework import serializers
from apps.system.domain.models import IntegrationKey

class IntegrationKeySerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    
    class Meta:
        model = IntegrationKey
        fields = ['id', 'name', 'key_prefix', 'is_active', 'last_used_at', 'expires_at', 'created_by_email', 'created_at']
        read_only_fields = ['id', 'key_prefix', 'last_used_at', 'created_by_email', 'created_at']
