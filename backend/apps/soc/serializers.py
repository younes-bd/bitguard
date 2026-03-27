"""
SOC Serializers — Explicit fields for all models including Security Platform models.
"""
from rest_framework import serializers
from .models import (
    Alert, Incident, ThreatIntelligence, LogAnalysis,
    Workspace, ManagedEndpoint, CloudApp, SystemMonitor,
    NetworkEvent, CloudIntegration, RemoteSession,
)


# ─── Internal SOC ───────────────────────────────────────

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['id', 'title', 'description', 'severity', 'source', 'is_resolved', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['id', 'title', 'description', 'status', 'alerts', 'assigned_to', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ThreatIntelligenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThreatIntelligence
        fields = ['id', 'indicator', 'indicator_type', 'confidence', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class LogAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogAnalysis
        fields = ['id', 'source_system', 'raw_log', 'parsed_data', 'flagged_anomalous', 'created_at']
        read_only_fields = ['id', 'created_at']


# ─── Security Platform (Customer-facing) ─────────────────

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['id', 'name', 'description', 'is_active', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class ManagedEndpointSerializer(serializers.ModelSerializer):
    workspace_name = serializers.ReadOnlyField(source='workspace.name')

    class Meta:
        model = ManagedEndpoint
        fields = [
            'id', 'workspace', 'workspace_name', 'hostname', 'ip_address', 'mac_address',
            'device_type', 'os', 'status', 'agent_version', 'last_seen', 'risk_score',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CloudAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudApp
        fields = [
            'id', 'workspace', 'name', 'provider', 'app_url',
            'status', 'users_count', 'risk_level', 'last_reviewed', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class SystemMonitorSerializer(serializers.ModelSerializer):
    endpoint_hostname = serializers.ReadOnlyField(source='endpoint.hostname')

    class Meta:
        model = SystemMonitor
        fields = [
            'id', 'endpoint', 'endpoint_hostname', 'cpu_usage', 'ram_usage',
            'disk_usage', 'uptime_seconds', 'is_anomalous', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class NetworkEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkEvent
        fields = [
            'id', 'workspace', 'source_ip', 'destination_ip', 'source_port',
            'destination_port', 'protocol', 'category', 'is_blocked', 'details', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class CloudIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudIntegration
        fields = [
            'id', 'workspace', 'name', 'provider', 'status',
            'last_sync', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'config', 'created_at', 'updated_at']  # config is write-only for security


class RemoteSessionSerializer(serializers.ModelSerializer):
    endpoint_hostname = serializers.ReadOnlyField(source='endpoint.hostname')
    initiated_by_email = serializers.ReadOnlyField(source='initiated_by.email')

    class Meta:
        model = RemoteSession
        fields = [
            'id', 'endpoint', 'endpoint_hostname', 'initiated_by', 'initiated_by_email',
            'status', 'started_at', 'ended_at', 'purpose', 'created_at',
        ]
        read_only_fields = ['id', 'session_token', 'initiated_by', 'created_at']
