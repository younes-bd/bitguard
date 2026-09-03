"""
Purchase Models — Supplier and Procurement Management.
"""
from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel
from django.utils import timezone


class Vendor(TenantAwareModel):
    """Hardware and software suppliers."""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('blacklisted', 'Blacklisted'),
    ]
    name = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    lead_time_days = models.IntegerField(default=7, help_text="Average delivery time in days")
    payment_terms = models.CharField(max_length=100, blank=True, help_text="e.g. Net 30")
    country = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name


class PurchaseOrder(TenantAwareModel):
    """Order placed to a vendor to restock inventory."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent to Vendor'),
        ('confirmed', 'Confirmed'),
        ('in_transit', 'In Transit'),
        ('received', 'Received'),
        ('cancelled', 'Cancelled'),
    ]
    vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    po_number = models.CharField(max_length=100, blank=True)
    order_date = models.DateField(null=True, blank=True)
    expected_date = models.DateField(null=True, blank=True)
    received_date = models.DateField(null=True, blank=True)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='purchase_orders'
    )
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_purchase_orders')

    class Meta:
        verbose_name = 'Purchase Order'

    def __str__(self):
        return f"PO #{self.id} — {self.vendor.name} ({self.status})"

    @classmethod
    def flag_delayed_deliveries(cls):
        from django.utils import timezone
        today = timezone.now().date()
        delayed = cls.objects.filter(status='sent', expected_date__lt=today)
        count = delayed.count()
        print(f"[Cron Job] Found {count} delayed purchase orders.")


class PurchaseOrderLine(BaseModel):
    """Individual line item within a PurchaseOrder. Supports both inventory and ad-hoc items."""
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='lines')
    inventory_item = models.ForeignKey(
        'stock.InventoryItem', on_delete=models.PROTECT, related_name='purchase_lines', null=True, blank=True
    )
    description = models.CharField(max_length=255, blank=True)
    quantity_ordered = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    quantity_received = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    analytic_account = models.ForeignKey('accounting.AnalyticAccount', on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def line_total(self):
        return self.quantity_ordered * self.unit_cost

    def __str__(self):
        if self.inventory_item:
            return f"Item ID {self.inventory_item_id} x{self.quantity_ordered}"
        return f"{self.description} x{self.quantity_ordered}"

    class Meta:
        verbose_name = 'Purchase Order Line'


class RFQ(TenantAwareModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='rfqs')
    rfq_number = models.CharField(max_length=100)
    date = models.DateField(default=timezone.now)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default='draft', choices=[
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled')
    ])

    class Meta:
        verbose_name = 'Request for Quotation'


class VendorPricelist(TenantAwareModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='pricelists')
    inventory_item = models.ForeignKey('stock.InventoryItem', on_delete=models.CASCADE, related_name='vendor_prices')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    min_quantity = models.IntegerField(default=1)
    valid_from = models.DateField(null=True, blank=True)
    valid_to = models.DateField(null=True, blank=True)


