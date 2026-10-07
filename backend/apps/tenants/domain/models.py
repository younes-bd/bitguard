from apps.base.validators import validate_image_file
from django.db import models
from apps.base.domain.models import UUIDModel

def default_modules():
    return ["core"]

class Tenant(UUIDModel):
    name = models.CharField(max_length=255)
    partner = models.ForeignKey('base.Partner', on_delete=models.SET_NULL, null=True, blank=True, related_name='saas_tenants', help_text="The core Partner that owns this SaaS workspace.")
    domain = models.CharField(max_length=255, unique=True, help_text="Subdomain or custom domain")
    subscription_plan = models.CharField(max_length=100, default='free')
    is_active = models.BooleanField(default=True)
    allowed_modules = models.JSONField(default=default_modules, help_text="List of enabled modules (e.g. ['crm', 'soc'])")
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True, help_text="Company Logo", validators=[validate_image_file])
    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'

    def __str__(self):
        return self.name


class SecurityPolicy(UUIDModel):
    tenant = models.OneToOneField('Tenant', on_delete=models.CASCADE, null=True, blank=True, related_name='security_policy')
    password_complexity = models.CharField(max_length=20, default='high')
    session_timeout = models.IntegerField(default=60) # Minutes
    mfa_required = models.BooleanField(default=True)
    api_key_rotation = models.IntegerField(default=90) # Days
    ip_whitelist = models.TextField(blank=True, help_text="Comma-separated CIDR ranges")
    failed_login_lock = models.IntegerField(default=5)
    lock_duration = models.IntegerField(default=30) # Minutes
    concurrent_sessions = models.CharField(max_length=20, default='1')

    