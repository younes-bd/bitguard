from rest_framework import serializers
from ..domain.models import Notification, NotificationPreference

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['id', 'type', 'in_app_enabled', 'email_enabled', 'sms_enabled']
        read_only_fields = ['id', 'type']
