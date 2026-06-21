from django.db import models
from apps.core.models import BaseModel, TenantAwareModel

class SystemSetting(TenantAwareModel):
    SETTING_TYPES = (
        ('string', 'String'),
        ('boolean', 'Boolean'),
        ('integer', 'Integer'),
        ('json', 'JSON'),
    )

    key = models.CharField(max_length=255, help_text="Unique identifier for the setting")
    value = models.TextField(blank=True, help_text="Value of the setting")
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES, default='string')
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False, help_text="Can be exposed to unauthenticated users")

    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"
        ordering = ['key']
        unique_together = ('tenant', 'key')

    def __str__(self):
        return f"{self.key}: {self.value}"

class AuditTrail(TenantAwareModel):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('settings_change', 'Settings Change'),
    )
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=255, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        verbose_name = "Audit Trail"
        verbose_name_plural = "Audit Trails"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} on {self.resource_type} at {self.created_at}"

class PlatformAPIKey(TenantAwareModel):
    name = models.CharField(max_length=255)
    key_prefix = models.CharField(max_length=10, help_text="First few characters of the key for display")
    hashed_key = models.CharField(max_length=128, help_text="Hashed version of the secret key")
    is_active = models.BooleanField(default=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_platform_api_keys')

    class Meta:
        verbose_name = "Platform API Key"
        verbose_name_plural = "Platform API Keys"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.key_prefix}***)"

class WebhookEndpoint(TenantAwareModel):
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=1024)
    secret = models.CharField(max_length=255, blank=True, help_text="Secret for signing payload")
    is_active = models.BooleanField(default=True)
    events = models.JSONField(default=list, help_text="List of events to trigger this webhook")
    
    class Meta:
        verbose_name = "Webhook Endpoint"
        verbose_name_plural = "Webhook Endpoints"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class DatabaseBackup(TenantAwareModel):
    filename = models.CharField(max_length=255)
    size_bytes = models.BigIntegerField()
    status = models.CharField(max_length=50, default='completed')
    triggered_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = "Database Backup"
        verbose_name_plural = "Database Backups"
        ordering = ['-created_at']

    def __str__(self):
        return self.filename
