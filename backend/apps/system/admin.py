from django.contrib import admin
try:
    from .domain.models import SystemSetting, WebhookEndpoint, DatabaseBackup, ApiKey
    admin.site.register(SystemSetting)
    admin.site.register(WebhookEndpoint)
    admin.site.register(DatabaseBackup)
    admin.site.register(ApiKey)
except ImportError:
    pass
