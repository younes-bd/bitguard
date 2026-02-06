from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api

router = DefaultRouter()
router.register(r'assets', api.AssetViewSet)
router.register(r'vulnerabilities', api.VulnerabilityViewSet)
router.register(r'indicators', api.IndicatorViewSet)
router.register(r'alerts', api.SecurityAlertViewSet)
router.register(r'incidents', api.SecurityIncidentViewSet)
router.register(r'email-threats', api.EmailThreatViewSet)
router.register(r'cloud-apps', api.CloudAppViewSet)
router.register(r'network-events', api.NetworkEventViewSet)
router.register(r'remediations', api.RemediationActionViewSet)
router.register(r'security-gaps', api.SecurityGapViewSet)
router.register(r'stats', api.SecurityStatsViewSet, basename='security-stats')

urlpatterns = [
    path('api/', include(router.urls)),
]
