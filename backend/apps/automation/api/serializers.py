from rest_framework import serializers
from apps.automation.domain.models import AutomatedAction

class AutomatedActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomatedAction
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']


from apps.automation.domain.models import WebhookEndpoint

class WebhookEndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookEndpoint
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
