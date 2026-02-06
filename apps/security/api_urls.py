from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import (
    SecurityStatsViewSet,
    SecurityAlertViewSet,
    SecurityIncidentViewSet,
    AssetViewSet,
    VulnerabilityViewSet,
    IndicatorViewSet,
    EmailThreatViewSet,
    CloudAppViewSet,
    NetworkEventViewSet,
    RemediationActionViewSet,
    SecurityGapViewSet
)

router = DefaultRouter()
router.register(r'stats', SecurityStatsViewSet, basename='stats')
router.register(r'alerts', SecurityAlertViewSet)
router.register(r'incidents', SecurityIncidentViewSet)
router.register(r'assets', AssetViewSet)
router.register(r'vulnerabilities', VulnerabilityViewSet)
router.register(r'indicators', IndicatorViewSet)
router.register(r'email-threats', EmailThreatViewSet)
router.register(r'cloud-apps', CloudAppViewSet)
router.register(r'network-events', NetworkEventViewSet)
router.register(r'remediation', RemediationActionViewSet)
router.register(r'security-gaps', SecurityGapViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
