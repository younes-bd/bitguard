from rest_framework import serializers
from apps.system.domain.models import SystemSetting, ApiKey, WebhookEndpoint, DatabaseBackup, InstalledModule, Language, OutgoingMailServer, IncomingMailServer, EmailTemplate, MailAlias
from apps.reporting.domain.models import ReportTag, ReportTemplate as Report
from apps.core.domain.models import ScheduledAction, AuditTrail
from apps.automation.domain.models import AutomatedAction

class InstalledModuleSerializer(serializers.ModelSerializer):
    has_update = serializers.SerializerMethodField()

    class Meta:
        model = InstalledModule
        fields = '__all__'
        read_only_fields = ('tenant', 'technical_name')

    def get_has_update(self, obj):
        import os
        import ast
        from django.conf import settings
        manifest_path = os.path.join(settings.BASE_DIR, 'apps', obj.technical_name, '__manifest__.py')
        if os.path.exists(manifest_path):
            try:
                with open(manifest_path, 'r', encoding='utf-8') as f:
                    manifest_content = f.read()
                    manifest_dict = ast.literal_eval(manifest_content)
                    manifest_version = manifest_dict.get('version', '')
                    return bool(manifest_version and manifest_version != obj.version)
            except Exception:
                pass
        return False

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
        model = ApiKey
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
    smtp_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = OutgoingMailServer
        fields = '__all__'
        read_only_fields = ('tenant',)
        extra_kwargs = {'smtp_password': {'write_only': True}}

class IncomingMailServerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = IncomingMailServer
        fields = '__all__'
        read_only_fields = ('tenant',)
        extra_kwargs = {'password': {'write_only': True}}

class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class MailAliasSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailAlias
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class AutomatedActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomatedAction
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class ReportTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTag
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
