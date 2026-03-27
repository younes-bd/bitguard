from django.db import models
from apps.core.models import TenantAwareModel, TimeStampedModel

class SystemSetting(TenantAwareModel, TimeStampedModel):
    SETTING_TYPES = (
        ('string', 'String'),
        ('boolean', 'Boolean'),
        ('integer', 'Integer'),
        ('json', 'JSON'),
    )

    key = models.CharField(max_length=255, unique=True, help_text="Unique identifier for the setting")
    value = models.TextField(blank=True, help_text="Value of the setting")
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES, default='string')
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False, help_text="Can be exposed to unauthenticated users")

    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"
        ordering = ['key']

    def __str__(self):
        return f"{self.key}: {self.value}"

class AuditTrail(TenantAwareModel, TimeStampedModel):
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
