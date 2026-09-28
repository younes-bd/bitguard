from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class PaymentSettings(TenantAwareModel):
    """
    Tenant-specific configuration for Stripe.
    MANDATORY for multi-tenant SaaS where tenants receive their own money.
    """
    stripe_publishable_key = models.CharField(max_length=255, blank=True, null=True)
    stripe_secret_key = models.CharField(max_length=255, blank=True, null=True)
    stripe_webhook_secret = models.CharField(max_length=255, blank=True, null=True)
    currency = models.CharField(max_length=10, default='USD')

    class Meta:
        verbose_name_plural = "Payment Settings"

class PaymentTransaction(TenantAwareModel):
    """
    Log of all transactions processed through the integration.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded')
    ]

    transaction_id = models.CharField(max_length=255, unique=True, help_text="Stripe PaymentIntent ID")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Generic relation to tie to accounting.Invoice or subscriptions.ServiceContract
    # For loose coupling without circular imports, store the reference as string/ID
    reference_type = models.CharField(max_length=50, blank=True, null=True, help_text="e.g., 'invoice', 'subscription'")
    reference_id = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.amount} {self.currency} ({self.status})"
