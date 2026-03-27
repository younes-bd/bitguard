"""
SCM Models — Supply Chain & Inventory Management.
Manages hardware vendors, stock, purchase orders, and shipments.
"""
from django.db import models
from django.conf import settings
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel, TenantAwareModel


class Vendor(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
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


class InventoryItem(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """Physical product stock record. Linked to store.Product."""
    product_id = models.IntegerField(null=True, blank=True, help_text="FK to store.Product")
    product_name = models.CharField(max_length=255, help_text="Snapshot of product name")
    sku = models.CharField(max_length=100, blank=True)
    quantity_on_hand = models.IntegerField(default=0)
    quantity_reserved = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=5, help_text="Trigger reorder when stock falls below this")
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    location = models.CharField(max_length=100, blank=True, help_text="Warehouse / shelf location")
    vendor = models.ForeignKey(
        Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='inventory_items'
    )

    class Meta:
        verbose_name = 'Inventory Item'

    @property
    def quantity_available(self):
        return self.quantity_on_hand - self.quantity_reserved

    @property
    def is_low_stock(self):
        return self.quantity_available <= self.reorder_level

    def __str__(self):
        return f"{self.product_name} (Stock: {self.quantity_on_hand})"


class PurchaseOrder(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
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
    order_date = models.DateField(null=True, blank=True)
    expected_date = models.DateField(null=True, blank=True)
    received_date = models.DateField(null=True, blank=True)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='purchase_orders'
    )

    class Meta:
        verbose_name = 'Purchase Order'

    def __str__(self):
        return f"PO #{self.id} — {self.vendor.name} ({self.status})"


class PurchaseOrderLine(UUIDPrimaryKeyModel, TimeStampedModel):
    """Individual line item within a PurchaseOrder."""
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='lines')
    inventory_item = models.ForeignKey(
        InventoryItem, on_delete=models.PROTECT, related_name='purchase_lines'
    )
    quantity_ordered = models.IntegerField()
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    quantity_received = models.IntegerField(default=0)

    @property
    def line_total(self):
        return self.quantity_ordered * self.unit_cost

    def __str__(self):
        return f"{self.inventory_item.product_name} x{self.quantity_ordered}"

    class Meta:
        verbose_name = 'Purchase Order Line'
