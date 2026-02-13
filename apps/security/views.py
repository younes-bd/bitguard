from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Asset, Vulnerability, Indicator, SecurityAlert,
    SecurityIncident, EmailThreat, CloudApp, NetworkEvent, RemediationAction, SecurityGap
)
from .serializers import (
    AssetSerializer,
    VulnerabilitySerializer,
    IndicatorSerializer,
    SecurityAlertSerializer,
    SecurityIncidentSerializer,
    EmailThreatSerializer,
    CloudAppSerializer,
    NetworkEventSerializer,
    RemediationActionSerializer,
    SecurityGapSerializer
)
from .services import ScoringEngine, RuleEngine, PlaybookService, IncidentService
from apps.core.permissions import ConstitutionPermission
from apps.core.services.audit import AuditService


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by('name')
    serializer_class = AssetSerializer
    permission_classes = [ConstitutionPermission]
    filterset_fields = ['status', 'asset_type', 'criticality', 'owner']

    @action(detail=True, methods=['post'])
    def isolate_asset(self, request, pk=None):
        asset = self.get_object()
        asset.status = 'isolated'
        asset.save()
        AuditService.log(request, action="ASSET_ISOLATED", resource=f"security.Asset:{asset.pk}", payload={})
        return Response({'status': 'isolated', 'id': asset.id, 'name': asset.name})

class VulnerabilityViewSet(viewsets.ModelViewSet):
    queryset = Vulnerability.objects.all().order_by('-severity')
    serializer_class = VulnerabilitySerializer
    permission_classes = [ConstitutionPermission]

class IndicatorViewSet(viewsets.ModelViewSet):
    queryset = Indicator.objects.all().order_by('-created_at')
    serializer_class = IndicatorSerializer
    permission_classes = [ConstitutionPermission]

class SecurityAlertViewSet(viewsets.ModelViewSet):
    queryset = SecurityAlert.objects.all().order_by('-timestamp')
    serializer_class = SecurityAlertSerializer
    permission_classes = [ConstitutionPermission]

    def perform_create(self, serializer):
        alert = serializer.save()
        alert.score = ScoringEngine.calculate_score(alert)
        alert.save()
        AuditService.log(
            self.request,
            action="SECURITY_ALERT_CREATED",
            resource=f"security.Alert:{alert.pk}",
            payload=serializer.data
        )

class SecurityIncidentViewSet(viewsets.ModelViewSet):
    queryset = SecurityIncident.objects.all().order_by('-created_at')
    serializer_class = SecurityIncidentSerializer
    permission_classes = [ConstitutionPermission]

    def perform_create(self, serializer):
        # SOC Authority (Section 5)
        incident = IncidentService.create_incident(
            title=serializer.validated_data['title'],
            description=serializer.validated_data['description'],
            severity=serializer.validated_data.get('severity', 'medium'),
            client=serializer.validated_data.get('client'),
            workspace=self.request.workspace if hasattr(self.request, 'workspace') else None,
            request=self.request
        )
        serializer.instance = incident

    @action(detail=True, methods=['post'])
    def transition(self, request, pk=None):
        incident = self.get_object()
        new_status = request.data.get('status')
        try:
            IncidentService.transition_state(incident, new_status, request.user, request=request)
            return Response({'status': 'success', 'new_status': incident.status})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EmailThreatViewSet(viewsets.ModelViewSet):
    queryset = EmailThreat.objects.all().order_by('-detected_at')
    serializer_class = EmailThreatSerializer
    permission_classes = [ConstitutionPermission]

class CloudAppViewSet(viewsets.ModelViewSet):
    queryset = CloudApp.objects.all().order_by('-risk_score')
    serializer_class = CloudAppSerializer
    permission_classes = [ConstitutionPermission]

class SecurityStatsViewSet(viewsets.ViewSet):
    permission_classes = [ConstitutionPermission]

    def list(self, request):
        return Response({
            'assets': {
                'total': Asset.objects.count(),
                'active': Asset.objects.filter(status='active').count(),
                'compromised': Asset.objects.filter(status='compromised').count()
            },
            'alerts': {
                'total': SecurityAlert.objects.count(),
                'critical': SecurityAlert.objects.filter(severity='critical').count(),
                'high': SecurityAlert.objects.filter(severity='high').count(),
                'open': SecurityAlert.objects.exclude(status='closed').count(),
                'recent': SecurityAlertSerializer(SecurityAlert.objects.order_by('-timestamp')[:5], many=True).data
            },
            'incidents': {
                'total': SecurityIncident.objects.count(),
                'active': SecurityIncident.objects.filter(status='active').count()
            },
            'vulnerabilities': {
                'total': Vulnerability.objects.count(),
                'critical': Vulnerability.objects.filter(severity='critical').count()
            },
            'email_threats': {
                'total': EmailThreat.objects.count(),
                'blocked': EmailThreat.objects.filter(status='blocked').count()
            },
            'cloud_apps': {
                'total': CloudApp.objects.count(),
                'high_risk': CloudApp.objects.filter(risk_level='high').count()
            },
            'network_events': {
                'total': NetworkEvent.objects.count(),
                'suspicious': NetworkEvent.objects.filter(action='block').count() 
            },
            'security_gaps': {
                'total': SecurityGap.objects.count(),
                'critical': SecurityGap.objects.filter(severity='critical').count()
            }
        })

class NetworkEventViewSet(viewsets.ModelViewSet):
    queryset = NetworkEvent.objects.all().order_by('-timestamp')
    serializer_class = NetworkEventSerializer
    permission_classes = [ConstitutionPermission]

class RemediationActionViewSet(viewsets.ModelViewSet):
    queryset = RemediationAction.objects.all().order_by('-timestamp')
    serializer_class = RemediationActionSerializer
    permission_classes = [ConstitutionPermission]
    filterset_fields = ['status', 'automated']

class SecurityGapViewSet(viewsets.ModelViewSet):
    queryset = SecurityGap.objects.all().order_by('-created_at')
    serializer_class = SecurityGapSerializer
    permission_classes = [ConstitutionPermission]
