from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

# Core app now serves as a utility belt and middleware container.
# All business logic models have been moved to domain-specific apps:
# - Identity -> apps.accounts
# - Identity Access (RBAC) -> apps.access
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
    resource = models.CharField(max_length=255) # e.g. "accounts.Profile:123"
    payload = models.JSONField(default=dict, blank=True, help_text=_("Metadata associated with the action"))
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp} - {self.action} by {self.user}"
