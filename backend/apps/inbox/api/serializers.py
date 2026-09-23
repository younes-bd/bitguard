from apps.inbox.domain.models import IncomingMailServer, OutgoingMailServer, EmailTemplate, MailAlias
from rest_framework import serializers
from ..domain.models import Notification, NotificationPreference

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['id', 'type', 'in_app_enabled', 'email_enabled', 'sms_enabled']
        read_only_fields = ['id', 'type']

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

