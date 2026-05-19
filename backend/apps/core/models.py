import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings
from apps.core.middleware import get_current_tenant
from django.utils.translation import gettext_lazy as _

class BaseModel(models.Model):
    """
    Standard base model for all BitGuard entities.
    Includes UUID PK, tenant context, soft-delete, and audit timestamps.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, null=True, blank=True, related_name='%(class)s_set')
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(app_label)s_%(class)s_created')

    class Meta:
        abstract = True

class TenantAwareManager(models.Manager):
    def get_queryset(self):
        # Initial filter for soft-delete (if needed) and tenant
        tenant = get_current_tenant()
        qs = super().get_queryset().filter(is_deleted=False)
        if tenant:
            return qs.filter(tenant=tenant)
        return qs

class TenantAwareModel(BaseModel):
    """
    Specialized model that automatically filters queries by the current tenant context.
    """
    objects = TenantAwareManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

# Core app now serves as a utility belt and middleware container.
# All business logic models have been moved to domain-specific apps:
# - Identity -> apps.users
# - Identity Access (RBAC) -> apps.auth
# - Tenancy -> apps.tenants
# - Notifications -> apps.notifications

# AuditLog has been moved to apps.audit to align with domain-driven design.
# See apps.audit.models.AuditLog for the centralized implementation.
