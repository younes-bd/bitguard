from rest_framework import serializers
from .models import AISettings, AIUsageLog

class AISettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISettings
        fields = '__all__'
        read_only_fields = ('tenant',)
        extra_kwargs = {
            'openai_api_key':    {'write_only': True},
            'anthropic_api_key': {'write_only': True},
        }

class AIUsageLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIUsageLog
        fields = '__all__'
        read_only_fields = ('tenant', 'user', 'cost_usd', 'tokens_used')
