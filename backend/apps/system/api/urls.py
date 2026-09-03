from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SystemSettingViewSet, AuditTrailViewSet, APIKeyViewSet, WebhookEndpointViewSet, DatabaseBackupViewSet, InstalledModuleViewSet, LanguageViewSet, ScheduledActionViewSet, EmailConfigViewSet, OutgoingMailServerViewSet, IncomingMailServerViewSet, EmailTemplateViewSet, MailAliasViewSet, AutomatedActionViewSet, ReportTagsViewSet, ReportsViewSet, TranslationViewSet, CommandCenterSectionViewSet

router = DefaultRouter()
router.register(r'modules', InstalledModuleViewSet, basename='settings-modules')
router.register(r'sections', CommandCenterSectionViewSet, basename='command-center-sections')
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
router.register(r'mail-aliases', MailAliasViewSet, basename='settings-mail-aliases')
router.register(r'automated-actions', AutomatedActionViewSet, basename='settings-automated-actions')
router.register(r'report-tags', ReportTagsViewSet, basename='settings-report-tags')
router.register(r'reports', ReportsViewSet, basename='settings-reports')
router.register(r'translations', TranslationViewSet, basename='translations')
urlpatterns = [
    path('', include(router.urls)),
]


