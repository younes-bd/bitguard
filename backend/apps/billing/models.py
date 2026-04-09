from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.models import TenantAwareModel, TimeStampedModel, UUIDPrimaryKeyModel

class Plan(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Platform Subscription Plans (e.g., Essential, Pro, Enterprise)
    Controls access to dashboard modules.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_price_id_monthly = models.CharField(max_length=100)
    stripe_price_id_yearly = models.CharField(max_length=100)
    included_modules = models.JSONField(default=list, help_text="Modules: endpoint, cloud, email, alerts, reports")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Subscription(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    User's active subscription to the platform.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('trial', 'Free Trial'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('incomplete', 'Incomplete'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name='subscriptions')
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='incomplete')
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({self.status})"

    @property
    def is_valid(self):
        return self.status in ['active', 'trial', 'past_due'] and (self.current_period_end is None or self.current_period_end > timezone.now())


class Invoice(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Financial record of a transaction.
    """
    invoice_number = models.CharField(max_length=50, unique=True, default="INV-PENDING")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='invoices', null=True, blank=True)
    status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('paid', 'Paid'), ('void', 'Void')], default='pending')
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default="USD")
    payment_method = models.CharField(max_length=50, blank=True)
    stripe_invoice_id = models.CharField(max_length=200, blank=True)
    pdf_url = models.URLField(max_length=500, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Invoice #{self.invoice_number} - {self.user}'


class BillingSettings(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Global settings for billing (formerly StoreSettings).
    """
    tenant = models.OneToOneField('tenants.Tenant', on_delete=models.CASCADE, related_name='billing_settings', null=True, blank=True)
    merchant_name = models.CharField(max_length=200, default="BitGuard Inc.")
    currency = models.CharField(max_length=10, default="USD", choices=[
        ('USD', 'USD ($)'),
        ('EUR', 'EUR (€)'),
        ('GBP', 'GBP (£)'),
        ('DZD', 'DZD (DA)'),
    ])
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    email_notifications = models.BooleanField(default=True)
    auto_process_orders = models.BooleanField(default=False)
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Billing Settings ({self.currency})"

    class Meta:
        verbose_name_plural = "Billing Settings"
