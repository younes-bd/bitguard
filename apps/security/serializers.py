from rest_framework import serializers
from .models import Asset, Vulnerability, Indicator, SecurityAlert, SecurityIncident, EmailThreat, CloudApp, NetworkEvent, RemediationAction, SecurityGap

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'

class VulnerabilitySerializer(serializers.ModelSerializer):
    affected_assets_count = serializers.IntegerField(source='affected_assets.count', read_only=True)

    class Meta:
        model = Vulnerability
        fields = '__all__'

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = '__all__'

class SecurityAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityAlert
        fields = '__all__'

class SecurityIncidentSerializer(serializers.ModelSerializer):
    alerts = SecurityAlertSerializer(many=True, read_only=True)
    
    class Meta:
        model = SecurityIncident
        fields = '__all__'

class EmailThreatSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailThreat
        fields = '__all__'

class CloudAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudApp
        fields = '__all__'

class NetworkEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkEvent
        fields = '__all__'

class RemediationActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RemediationAction
        fields = '__all__'

class SecurityGapSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityGap
        fields = '__all__'
