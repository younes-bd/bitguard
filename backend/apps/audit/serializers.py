from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['id', 'user', 'action', 'resource_type', 'resource_id', 'details', 'ip_address', 'created_at', 'user_email']

    def get_user_email(self, obj):
        return obj.user.email if obj.user else "System"
