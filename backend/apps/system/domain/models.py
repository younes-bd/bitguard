from django.db import models
from apps.base.domain.models import TenantAwareModel

class IntegrationKey(TenantAwareModel):
    name = models.CharField(max_length=255)
    key_prefix = models.CharField(max_length=10, help_text="First few characters of the key for display")
    hashed_key = models.CharField(max_length=128, help_text="Hashed version of the secret key")
    is_active = models.BooleanField(default=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_integration_keys')

    class Meta:
        verbose_name = "Integration Key"
        verbose_name_plural = "Integration Keys"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.key_prefix}***)"
