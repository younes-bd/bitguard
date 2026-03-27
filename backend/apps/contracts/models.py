"""
Contracts Models — Service Contract & SLA Management (Sprint 3).
Manages customer service agreements, SLA tiers, quotes, and breach tracking.
"""
from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel, TenantAwareModel


class SLATier(UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Defines an SLA tier (e.g. Basic, Standard, Premium, Critical).
    Reusable across multiple contracts.
    """
    COVERAGE_CHOICES = [
        ('business_hours', 'Business Hours (8x5)'),
        ('extended', 'Extended (12x5)'),
        ('always_on', '24x7'),
    ]
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    first_response_hours = models.IntegerField(help_text="Max hours to first response")
    resolution_hours = models.IntegerField(help_text="Max hours to resolution")
    uptime_percent = models.DecimalField(
        max_digits=5, decimal_places=2, default=99.9,
        help_text="Guaranteed uptime (e.g. 99.9)"
    )
    coverage = models.CharField(max_length=20, choices=COVERAGE_CHOICES, default='business_hours')

    def __str__(self):
        return f"{self.name} ({self.first_response_hours}h response / {self.resolution_hours}h resolution)"


class ServiceContract(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    A formal service agreement between BitGuard and a client.
    Charter §25: Every managed service contract must reference a SLA tier.
    """
    TYPE_CHOICES = [
        ('msp', 'Managed Service (MSP)'),
        ('retainer', 'Retainer'),
        ('project', 'Project-based'),
        ('support', 'Support Contract'),
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
    sla_tier = models.ForeignKey(SLATier, on_delete=models.PROTECT, related_name='contracts')
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
        today = timezone.now().date()
        return self.status == 'active' and self.start_date <= today <= self.end_date

    @property
    def annual_value(self):
        return self.monthly_value * 12

    class Meta:
        verbose_name = 'Service Contract'

    def __str__(self):
        return f"{self.client.name} — {self.contract_type} ({self.status})"


class SLABreach(UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Charter §25: SLA breaches must be logged and trigger notifications.
    Automatically created when a support ticket exceeds SLA tier thresholds.
    """
    BREACH_TYPE_CHOICES = [
        ('first_response', 'First Response Exceeded'),
        ('resolution', 'Resolution Time Exceeded'),
        ('uptime', 'Uptime SLA Violated'),
    ]
    contract = models.ForeignKey(ServiceContract, on_delete=models.CASCADE, related_name='sla_breaches')
    ticket_id = models.UUIDField(null=True, blank=True, help_text="UUID of the Support Ticket")
    breach_type = models.CharField(max_length=20, choices=BREACH_TYPE_CHOICES)
    breached_at = models.DateTimeField(default=timezone.now)
    acknowledged = models.BooleanField(default=False)
    resolution_note = models.TextField(blank=True)

    class Meta:
        verbose_name = 'SLA Breach'

    def __str__(self):
        return f"SLA Breach ({self.breach_type}) on {self.contract}"


class Quote(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    A formal price quotation sent to a CRM Client before a Deal closes.
    Accepted quotes auto-generate an ERP Invoice.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    deal = models.ForeignKey(
        'crm.Deal', on_delete=models.SET_NULL, null=True, blank=True, related_name='quotes'
    )
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE, related_name='quotes')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    valid_until = models.DateField(null=True, blank=True)
    discount_percent = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        help_text="Overall quote discount percentage"
    )
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_quotes'
    )

    @property
    def subtotal(self):
        return sum(line.line_total for line in self.lines.all())

    @property
    def total(self):
        discount = self.subtotal * (self.discount_percent / 100)
        return self.subtotal - discount

    class Meta:
        verbose_name = 'Quote'

    def __str__(self):
        return f"Quote #{self.id} — {self.client.name} ({self.status})"


class QuoteLine(UUIDPrimaryKeyModel, TimeStampedModel):
    """A line item in a Quote (service, product, license, hours)."""
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='lines')
    description = models.CharField(max_length=500)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    @property
    def line_total(self):
        return self.quantity * self.unit_price

    class Meta:
        verbose_name = 'Quote Line'

    def __str__(self):
        return f"{self.description} x{self.quantity} @ {self.unit_price}"
