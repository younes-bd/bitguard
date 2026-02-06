from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True, help_text=_("e.g. crm.view_leads"))
    product = models.CharField(max_length=50, help_text=_("Product this permission belongs to e.g. crm"))
    description = models.TextField(blank=True)

    def __str__(self):
        return self.code

class Role(models.Model):
    # Using string reference to Tenant to avoid circular import if possible, 
    # but tenant is in apps.tenants. We might need to import it.
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='roles')
    name = models.CharField(max_length=100)
    permissions = models.ManyToManyField(Permission, blank=True)

    class Meta:
        unique_together = ('tenant', 'name')

    def __str__(self):
        return f"{self.name} ({self.tenant})"

class UserRole(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='users')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'role')
