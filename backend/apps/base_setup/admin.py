from django.contrib import admin
try:
    from .domain.models import SystemSetting, WebhookEndpoint, DatabaseBackup, PlatformAPIKey
    admin.site.register(SystemSetting)
    admin.site.register(WebhookEndpoint)
    admin.site.register(DatabaseBackup)
    admin.site.register(PlatformAPIKey)
except ImportError:
    pass
