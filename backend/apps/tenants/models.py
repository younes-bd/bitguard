from django.db import models
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel

class Tenant(UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, unique=True, help_text="Subdomain or custom domain")
    subscription_plan = models.CharField(max_length=100, default='free')
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'

    def __str__(self):
        return self.name
