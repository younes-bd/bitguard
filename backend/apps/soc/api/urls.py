from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AlertViewSet, IncidentViewSet, ThreatIntelligenceViewSet, LogAnalysisViewSet,
    WorkspaceViewSet, ManagedEndpointViewSet, CloudAppViewSet, SystemMonitorViewSet,
    NetworkEventViewSet, CloudIntegrationViewSet, RemoteSessionViewSet,
    EventIngestView, ComplianceFrameworkViewSet, ComplianceControlViewSet
)

router = DefaultRouter()

# Internal SOC
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'incidents', IncidentViewSet, basename='incident')
router.register(r'threats', ThreatIntelligenceViewSet, basename='threat')
router.register(r'logs', LogAnalysisViewSet, basename='log')

# Security Platform (customer-facing)
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'endpoints', ManagedEndpointViewSet, basename='endpoint')
router.register(r'cloud-apps', CloudAppViewSet, basename='cloud-app')
router.register(r'monitors', SystemMonitorViewSet, basename='monitor')
router.register(r'network-events', NetworkEventViewSet, basename='network-event')
router.register(r'cloud-integrations', CloudIntegrationViewSet, basename='cloud-integration')
router.register(r'remote-sessions', RemoteSessionViewSet, basename='remote-session')
router.register(r'compliance-frameworks', ComplianceFrameworkViewSet, basename='compliance-framework')
router.register(r'compliance-controls', ComplianceControlViewSet, basename='compliance-control')

urlpatterns = [
    path('events/ingest/', EventIngestView.as_view(), name='event-ingest'),
    path('', include(router.urls)),
]
