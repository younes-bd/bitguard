from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class SMSSettings(TenantAwareModel):
    """
    Tenant-specific configuration for SMS (e.g., Twilio).
    """
    twilio_account_sid = models.CharField(max_length=255, blank=True, null=True)
    twilio_auth_token = models.CharField(max_length=255, blank=True, null=True)
    twilio_phone_number = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        verbose_name_plural = "SMS Settings"

class SMSLog(TenantAwareModel):
    """
    Log of all SMS messages sent, useful for billing and auditing.
    """
    STATUS_CHOICES = [
        ('queued', 'Queued'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed')
    ]

    to_number = models.CharField(max_length=50)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    provider_message_id = models.CharField(max_length=255, blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To: {self.to_number} - {self.status}"
