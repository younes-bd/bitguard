from apps.core.validators import validate_image_file
from django.db import models
from apps.core.domain.models import UUIDModel

def default_modules():
    return ["core"]

class Tenant(UUIDModel):
    name = models.CharField(max_length=255)
    partner = models.ForeignKey('core.Partner', on_delete=models.SET_NULL, null=True, blank=True, related_name='saas_tenants', help_text="The core Partner that owns this SaaS workspace.")
    domain = models.CharField(max_length=255, unique=True, help_text="Subdomain or custom domain")
    subscription_plan = models.CharField(max_length=100, default='free')
    is_active = models.BooleanField(default=True)
    allowed_modules = models.JSONField(default=default_modules, help_text="List of enabled modules (e.g. ['crm', 'soc'])")
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True, help_text="Company Logo", validators=[validate_image_file])
    vat = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    street = models.CharField(max_length=255, blank=True)
    street2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='branches')
    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'

    def __str__(self):
        return self.name
