from django.db import models
from django.conf import settings
from apps.core.domain.models import TenantAwareModel

class PortalAccess(TenantAwareModel):
    """Tracks which client users have portal access — Odoo equivalent of res.partner portal flag"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portal_access')
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    welcome_email_sent = models.BooleanField(default=False)

    class Meta:
        app_label = 'portal'

    def __str__(self):
        return f"Portal Access: {self.user}"

class PortalShare(TenantAwareModel):
    """Documents/records shared with a client via the portal"""
    RESOURCE_TYPES = [
        ('invoice', 'Invoice'),
        ('project', 'Project'),
        ('ticket', 'Support Ticket'),
        ('quote', 'Quotation'),
        ('contract', 'Contract'),
    ]
    resource_type = models.CharField(max_length=50, choices=RESOURCE_TYPES)
    resource_id = models.IntegerField()
    shared_with = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portal_shares')
    access_token = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'portal'

    def __str__(self):
        return f"Shared {self.resource_type} #{self.resource_id} with {self.shared_with}"
