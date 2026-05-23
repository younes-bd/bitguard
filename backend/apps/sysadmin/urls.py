from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SystemSettingViewSet, AuditTrailViewSet, APIKeyViewSet, WebhookEndpointViewSet, DatabaseBackupViewSet

router = DefaultRouter()
router.register(r'settings', SystemSettingViewSet, basename='sysadmin-setting')
router.register(r'audit-logs', AuditTrailViewSet, basename='sysadmin-audit')
router.register(r'api-keys', APIKeyViewSet, basename='sysadmin-api-keys')
router.register(r'webhooks', WebhookEndpointViewSet, basename='sysadmin-webhooks')
router.register(r'backups', DatabaseBackupViewSet, basename='sysadmin-backups')

urlpatterns = [
    path('', include(router.urls)),
]
