"""
SOC Views — Extended for Security Platform (SIEM/MDR/ITAM product).
Charter §8: Views orchestrate; services decide.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Alert, Incident, ThreatIntelligence, LogAnalysis,
    Workspace, ManagedEndpoint, CloudApp, SystemMonitor,
    NetworkEvent, CloudIntegration, RemoteSession,
)
from .serializers import (
    AlertSerializer, IncidentSerializer, ThreatIntelligenceSerializer, LogAnalysisSerializer,
    WorkspaceSerializer, ManagedEndpointSerializer, CloudAppSerializer, SystemMonitorSerializer,
    NetworkEventSerializer, CloudIntegrationSerializer, RemoteSessionSerializer,
)
from .services import (
    AlertService, IncidentService, ThreatIntelligenceService, LogAnalysisService,
    WorkspaceService, ManagedEndpointService, CloudAppService, SystemMonitorService,
    NetworkEventService, CloudIntegrationService, RemoteSessionService,
)
from apps.core.permissions import HasRole, IsSuperAdmin, ConstitutionPermission


# ─── Internal SOC ViewSets ───────────────────────────────────

class AlertViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSuperAdmin | HasRole(['SOC_ADMIN', 'SOC_ANALYST'])]
    serializer_class = AlertSerializer

    def get_queryset(self):
        return AlertService.get_queryset(self.request)

    def perform_create(self, serializer):
        AlertService.create_alert(self.request, serializer.validated_data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        AlertService.resolve_alert(request, self.get_object())
        return Response({'status': 'resolved'})


class IncidentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSuperAdmin | HasRole(['SOC_ADMIN', 'SOC_ANALYST'])]
    serializer_class = IncidentSerializer

    def get_queryset(self):
        return IncidentService.get_queryset(self.request)

    def perform_create(self, serializer):
        IncidentService.create_incident(self.request, serializer.validated_data)

    @action(detail=True, methods=['post'])
    def transition(self, request, pk=None):
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'status required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            updated = IncidentService.transition_incident(request, self.get_object(), new_status)
            return Response(IncidentSerializer(updated).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ThreatIntelligenceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ThreatIntelligenceSerializer

    def get_queryset(self):
        return ThreatIntelligenceService.get_queryset(self.request)


class LogAnalysisViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSuperAdmin | HasRole(['SOC_ADMIN', 'SOC_ANALYST'])]
    serializer_class = LogAnalysisSerializer

    def get_queryset(self):
        return LogAnalysisService.get_queryset(self.request)


# ─── Security Platform ViewSets (Customer-facing) ─────────────

class WorkspaceViewSet(viewsets.ModelViewSet):
    """Customer environment groupings (HQ Network, AWS Production, etc.)."""
    permission_classes = [IsAuthenticated]
    serializer_class = WorkspaceSerializer

    def get_queryset(self):
        return WorkspaceService.get_queryset(self.request)

    def perform_create(self, serializer):
        WorkspaceService.create_workspace(self.request, serializer.validated_data)


class ManagedEndpointViewSet(viewsets.ModelViewSet):
    """Managed devices — workstations, servers, firewalls."""
    permission_classes = [IsAuthenticated]
    serializer_class = ManagedEndpointSerializer

    def get_queryset(self):
        return ManagedEndpointService.get_queryset(self.request)

    def perform_create(self, serializer):
        ManagedEndpointService.create_endpoint(self.request, serializer.validated_data)

    @action(detail=True, methods=['post'])
    def isolate(self, request, pk=None):
        """Contain a compromised endpoint by isolating it from the network."""
        endpoint = self.get_object()
        ManagedEndpointService.isolate_endpoint(request, endpoint)
        return Response({'status': 'isolated', 'hostname': endpoint.hostname})


class CloudAppViewSet(viewsets.ModelViewSet):
    """Cloud applications in the customer's tech stack."""
    permission_classes = [IsAuthenticated]
    serializer_class = CloudAppSerializer

    def get_queryset(self):
        return CloudAppService.get_queryset(self.request)


class SystemMonitorViewSet(viewsets.ModelViewSet):
    """Real-time health metrics per endpoint."""
    permission_classes = [IsAuthenticated]
    serializer_class = SystemMonitorSerializer

    def get_queryset(self):
        return SystemMonitorService.get_queryset(self.request)


class NetworkEventViewSet(viewsets.ModelViewSet):
    """Network traffic and security events."""
    permission_classes = [IsAuthenticated]
    serializer_class = NetworkEventSerializer

    def get_queryset(self):
        return NetworkEventService.get_queryset(self.request)


class CloudIntegrationViewSet(viewsets.ModelViewSet):
    """Third-party integrations (Microsoft 365, AWS, Okta, Slack)."""
    permission_classes = [IsAuthenticated]
    serializer_class = CloudIntegrationSerializer

    def get_queryset(self):
        return CloudIntegrationService.get_queryset(self.request)

    def perform_create(self, serializer):
        CloudIntegrationService.connect_integration(self.request, serializer.validated_data)


class RemoteSessionViewSet(viewsets.ModelViewSet):
    """Auditable remote management sessions to customer endpoints."""
    permission_classes = [IsAuthenticated]
    serializer_class = RemoteSessionSerializer

    def get_queryset(self):
        return RemoteSessionService.get_queryset(self.request)

    def perform_create(self, serializer):
        endpoint = serializer.validated_data.get('endpoint')
        purpose = serializer.validated_data.get('purpose', '')
        RemoteSessionService.create_session(self.request, endpoint, purpose)

    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        """End an active remote session with audit trail."""
        session = self.get_object()
        RemoteSessionService.end_session(request, session)
        return Response({'status': 'ended'})

class SecurityStatsViewSet(viewsets.ViewSet):
    """
    Aggregated SOC metrics for the Command Center.
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        tenant = request.user.tenant if hasattr(request.user, 'tenant') else None
        return Response({
            'endpoints': {
                'total': ManagedEndpoint.objects.filter(tenant=tenant).count(),
                'online': ManagedEndpoint.objects.filter(tenant=tenant, status='online').count(),
                'at_risk': ManagedEndpoint.objects.filter(tenant=tenant, status='at_risk').count()
            },
            'alerts': {
                'total': Alert.objects.filter(tenant=tenant).count(),
                'unresolved': Alert.objects.filter(tenant=tenant, is_resolved=False).count(),
                'critical': Alert.objects.filter(tenant=tenant, severity='critical', is_resolved=False).count()
            },
            'incidents': {
                'total': Incident.objects.filter(tenant=tenant).count(),
                'open': Incident.objects.filter(tenant=tenant, status='open').count()
            },
            'cloud_apps': {
                'total': CloudApp.objects.filter(tenant=tenant).count(),
                'high_risk': CloudApp.objects.filter(tenant=tenant, risk_level='high').count()
            }
        })
