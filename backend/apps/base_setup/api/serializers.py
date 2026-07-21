from rest_framework import serializers
from apps.base_setup.domain.models import SystemSetting, AuditTrail, PlatformAPIKey, WebhookEndpoint, DatabaseBackup, ErpModule, Language, OutgoingMailServer, IncomingMailServer, EmailTemplate
from apps.core.domain.models import ScheduledAction

class ErpModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErpModule
        fields = '__all__'
        read_only_fields = ('tenant', 'technical_name')

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ['id', 'key', 'value', 'setting_type', 'description', 'is_public', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_value(self, value):
        # Additional validation logic based on setting_type could be implemented here
        return value

class AuditTrailSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = AuditTrail
        fields = ['id', 'user', 'user_email', 'user_name', 'action', 'resource_type', 'resource_id', 'details', 'ip_address', 'created_at']
        read_only_fields = fields

class PlatformAPIKeySerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    
    class Meta:
        model = PlatformAPIKey
        fields = ['id', 'name', 'key_prefix', 'is_active', 'last_used_at', 'expires_at', 'created_by_email', 'created_at']
        read_only_fields = ['id', 'key_prefix', 'last_used_at', 'created_by_email', 'created_at']

class WebhookEndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookEndpoint
        fields = ['id', 'name', 'url', 'is_active', 'events', 'created_at']
        read_only_fields = ['id', 'created_at']

class DatabaseBackupSerializer(serializers.ModelSerializer):
    triggered_by_email = serializers.EmailField(source='triggered_by.email', read_only=True)

    class Meta:
        model = DatabaseBackup
        fields = ['id', 'filename', 'size_bytes', 'status', 'triggered_by_email', 'created_at']
        read_only_fields = ['id', 'filename', 'size_bytes', 'status', 'triggered_by_email', 'created_at']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'
        read_only_fields = ('tenant',)

class ScheduledActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledAction
        fields = '__all__'
        read_only_fields = ('tenant',)

class OutgoingMailServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutgoingMailServer
        fields = ['id', 'name', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_encryption', 'is_active', 'sequence', 'created_at', 'updated_at']
        read_only_fields = ('tenant',)

class IncomingMailServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingMailServer
        fields = ['id', 'name', 'server_type', 'server', 'port', 'is_ssl', 'user', 'is_active', 'last_fetch', 'created_at', 'updated_at']

class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = '__all__'
