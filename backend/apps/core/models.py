import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings
from apps.core.middleware import get_current_tenant
from django.utils.translation import gettext_lazy as _

class UUIDPrimaryKeyModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        from django.db.models.signals import post_delete
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(using=using)
        # Emit post_delete so external listeners (integrations, caches) still fire
        post_delete.send(sender=self.__class__, instance=self, using=using)

    def restore(self, *args, **kwargs):
        self.is_deleted = False
        self.deleted_at = None
        self.save(*args, **kwargs)

class TenantAwareManager(models.Manager):
    def get_queryset(self):
        tenant = get_current_tenant()
        if tenant:
            return super().get_queryset().filter(tenant=tenant)
        return super().get_queryset()

class TenantAwareModel(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, related_name='+')

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

class AuditLog(models.Model):
    """
    Centralized audit log for critical system events.
    Ensures traceability for regulatory and financial compliance (Charter Section 11).
    """
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=255) # e.g. "PROFILE_UPDATE", "CHECKOUT_INITIATED"
    resource = models.CharField(max_length=255) # e.g. "users.Profile:123"
    payload = models.JSONField(default=dict, blank=True, help_text=_("Metadata associated with the action"))
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp} - {self.action} by {self.user}"
