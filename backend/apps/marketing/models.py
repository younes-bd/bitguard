from django.db import models
from django.conf import settings
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel

class Campaign(UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='marketing_campaigns', null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_campaigns')

    def __str__(self):
        return f"{self.name} ({self.status})"

class CampaignInteraction(UUIDPrimaryKeyModel, TimeStampedModel):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='interactions')
    lead = models.ForeignKey('crm.Lead', on_delete=models.SET_NULL, null=True, blank=True, related_name='marketing_interactions')
    interaction_type = models.CharField(max_length=50, help_text="e.g., Click, Open, Form Submit")
    details = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.interaction_type} on {self.campaign.name}"
