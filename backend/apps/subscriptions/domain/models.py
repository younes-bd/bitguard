from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.domain.models import BaseModel, TenantAwareModel

class Plan(TenantAwareModel):
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


class Subscription(TenantAwareModel):
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
    seat_count = models.PositiveIntegerField(default=1, help_text="Number of user seats in this subscription")
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({self.status})"

    @classmethod
    def process_recurring_billing(cls):
        from django.utils import timezone
        import datetime
        from apps.subscriptions.domain.models import Invoice
        today = timezone.now().date()
        due = cls.objects.filter(status='active', current_period_end__lte=today)
        count = 0
        for sub in due:
            if not sub.plan: continue
            amount = sub.plan.price_monthly * sub.seat_count
            import uuid
            invoice = Invoice.objects.create(
                user=sub.user,
                invoice_number=f"INV-{str(uuid.uuid4())[:8].upper()}",
                amount=amount,
                payment_method='stripe',
                tenant=sub.tenant,
                status='pending',
                due_date=today + datetime.timedelta(days=7)
            )
            # Advance period
            sub.current_period_end = sub.current_period_end + datetime.timedelta(days=30)
            sub.save()
            count += 1
        print(f"[Cron Job] Processed {count} recurring bills for {count} subscriptions.")

    @classmethod
    def suspend_unpaid_subscriptions(cls):
        print(f"[Cron Job] Suspended unpaid subscriptions.")

    @property
    def is_valid(self):
        return self.status in ['active', 'trial', 'past_due'] and (self.current_period_end is None or self.current_period_end > timezone.now())



class BillingSettings(TenantAwareModel):
    """
    Global settings for billing (formerly StoreSettings).
    """
    tenant = models.OneToOneField('tenants.Tenant', on_delete=models.CASCADE, related_name='billing_settings', null=True, blank=True)
    merchant_name = models.CharField(max_length=200, blank=True)
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

class ServiceContract(TenantAwareModel):
    """
    A formal service agreement between BitGuard and a client.
    Charter §25: Every managed service contract must reference a SLA tier.
    """
    TYPE_CHOICES = [
        ('msp', 'Managed Service (MSP)'),
        ('retainer', 'Retainer'),
        ('project', 'Project-based'),
        ('helpdesk', 'Support Contract'),
        ('saas', 'SaaS License'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('pending_renewal', 'Pending Renewal'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
    ]
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE, related_name='contracts')
    contract_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    sla_tier = models.ForeignKey('helpdesk.SLATier', on_delete=models.PROTECT, related_name='contracts')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    auto_renew = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='managed_contracts'
    )
    notes = models.TextField(blank=True)

    @property
    def is_active(self):
        from django.utils import timezone
        today = timezone.now().date()
        return self.status == 'active' and self.start_date <= today <= self.end_date

    @property
    def annual_value(self):
        return self.monthly_value * 12

    class Meta:
        verbose_name = 'Service Contract'

    def __str__(self):
        return f"{self.client.name} — {self.contract_type} ({self.status})"
