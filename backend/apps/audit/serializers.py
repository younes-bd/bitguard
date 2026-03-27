from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['id', 'user', 'action', 'resource_type', 'resource_id', 'details', 'ip_address', 'created_at']
