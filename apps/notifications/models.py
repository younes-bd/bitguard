from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Notification(models.Model):
    TYPES = [
        ('system', 'System'),
        ('crm', 'CRM'),
        ('erp', 'ERP'),
        ('soc', 'SOC'),
        ('store', 'Store')
    ]

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPES, default='system')
    title = models.CharField(max_length=255)
    message = models.TextField()
    payload = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.user})"
