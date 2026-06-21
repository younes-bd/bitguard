from django.db import models
from apps.core.models import UUIDModel

def default_modules():
    return ["core"]

class Tenant(UUIDModel):
    name = models.CharField(max_length=255)
    partner = models.ForeignKey('core.Partner', on_delete=models.SET_NULL, null=True, blank=True, related_name='saas_tenants', help_text="The core Partner that owns this SaaS workspace.")
    domain = models.CharField(max_length=255, unique=True, help_text="Subdomain or custom domain")
    subscription_plan = models.CharField(max_length=100, default='free')
    is_active = models.BooleanField(default=True)
    allowed_modules = models.JSONField(default=default_modules, help_text="List of enabled modules (e.g. ['crm', 'soc'])")

    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'

    def __str__(self):
        return self.name
