from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class ECOType(TenantAwareModel):
    """Type classification for Engineering Change Orders."""
    name = models.CharField(max_length=100)
    sequence = models.IntegerField(default=10)
    active = models.BooleanField(default=True)

    class Meta:
        app_label = 'mrp_plm'
class EngineeringChangeOrder(TenantAwareModel):
    name = models.CharField(max_length=255)
    product_id = models.IntegerField(help_text="Reference to inventory product")
    eco_type = models.ForeignKey(
        ECOType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ecos'
    )
    state = models.CharField(max_length=20, choices=[('draft', 'Draft'), ('confirmed', 'In Progress'), ('approved', 'Approved'), ('done', 'Done')], default='draft')
    note = models.TextField(blank=True)
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        app_label = 'mrp_plm'
