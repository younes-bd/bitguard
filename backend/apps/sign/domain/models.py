from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class SignatureRequest(TenantAwareModel):
    title = models.CharField(max_length=255)
    document_url = models.URLField(null=True, blank=True)
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='signature_requests')
    status = models.CharField(
        max_length=50, 
        choices=[('draft', 'Draft'), ('sent', 'Sent'), ('signed', 'Signed'), ('voided', 'Voided')], 
        default='draft'
    )
    
    def __str__(self):
        return self.title
