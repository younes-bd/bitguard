from apps.core.models import TenantAwareModel
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Notification(TenantAwareModel):
    TYPES = [
        ('system', 'System'),
        ('crm', 'CRM'),
        ('erp', 'ERP'),
        ('soc', 'SOC'),
        ('ecommerce', 'ecommerce'),
        ('billing', 'Billing'),
        ('hrm', 'HRM'),
        ('services', 'Services'),
        ('approvals', 'Approvals'),
        ('projects', 'Projects'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPES, default='system')
    title = models.CharField(max_length=255)
    message = models.TextField()
    payload = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    
    # Omni-channel delivery status
    delivered_in_app = models.BooleanField(default=True)
    delivered_email = models.BooleanField(default=False)
    delivered_sms = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.title} ({self.user})"

class NotificationPreference(TenantAwareModel):
    """
    Omni-channel routing preferences for users per notification type.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    type = models.CharField(max_length=20, choices=Notification.TYPES)
    
    in_app_enabled = models.BooleanField(default=True)
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'type')

    def __str__(self):
        return f"{self.user} - {self.type} Preferences"
