from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SystemSettingViewSet, AuditTrailViewSet, APIKeyViewSet, WebhookEndpointViewSet, DatabaseBackupViewSet, ErpModuleViewSet, LanguageViewSet, ScheduledActionViewSet, EmailConfigViewSet, OutgoingMailServerViewSet, IncomingMailServerViewSet, EmailTemplateViewSet

router = DefaultRouter()
router.register(r'modules', ErpModuleViewSet, basename='settings-modules')
router.register(r'settings', SystemSettingViewSet, basename='settings-setting')
router.register(r'audit-logs', AuditTrailViewSet, basename='settings-audit')
router.register(r'api-keys', APIKeyViewSet, basename='settings-api-keys')
router.register(r'webhooks', WebhookEndpointViewSet, basename='settings-webhooks')
router.register(r'backups', DatabaseBackupViewSet, basename='settings-backups')
router.register(r'languages', LanguageViewSet, basename='settings-languages')
router.register(r'scheduled-actions', ScheduledActionViewSet, basename='settings-scheduled-actions')
router.register(r'email-config', EmailConfigViewSet, basename='settings-email-config')
router.register(r'mail-servers-outgoing', OutgoingMailServerViewSet, basename='settings-outgoing-mail')
router.register(r'mail-servers-incoming', IncomingMailServerViewSet, basename='settings-incoming-mail')
router.register(r'email-templates', EmailTemplateViewSet, basename='settings-email-templates')
urlpatterns = [
    path('', include(router.urls)),
]

