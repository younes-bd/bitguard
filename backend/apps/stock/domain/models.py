"""
Inventory Models — Warehouse, Stock, and Logistics Management.
"""
from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel
from django.utils import timezone


class Warehouse(TenantAwareModel):
    name = models.CharField(max_length=100)
    location = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Warehouse'

    def __str__(self):
        return self.name

class InventoryItem(TenantAwareModel):
    """Physical product stock record. Linked to product.Product."""
    product = models.ForeignKey('product.Product', on_delete=models.CASCADE, null=True, blank=True, related_name='inventory_items')
    product_name = models.CharField(max_length=255, help_text="Snapshot of product name")
    sku = models.CharField(max_length=100, blank=True)
    quantity_on_hand = models.IntegerField(default=0)
    quantity_reserved = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=5, help_text="Trigger reorder when stock falls below this")
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    location = models.CharField(max_length=100, blank=True, help_text="Shelf location")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True, related_name='inventory_items')
    vendor = models.ForeignKey(
        'purchase.Vendor', on_delete=models.SET_NULL, null=True, blank=True, related_name='inventory_items'
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


class GoodsReceipt(TenantAwareModel):
    purchase_order = models.ForeignKey('purchase.PurchaseOrder', on_delete=models.CASCADE, related_name='receipts')
    receipt_number = models.CharField(max_length=100)
    received_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, default='draft', choices=[
        ('draft', 'Draft'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled')
    ])
    notes = models.TextField(blank=True)

class GoodsReceiptLine(TenantAwareModel):
    receipt = models.ForeignKey(GoodsReceipt, on_delete=models.CASCADE, related_name='lines')
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity_received = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.CharField(max_length=255, blank=True)

class StockMove(TenantAwareModel):
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='moves')
    receipt_line = models.ForeignKey(GoodsReceiptLine, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, help_text="Positive for in, negative for out")
    date = models.DateTimeField(default=timezone.now)
    reference = models.CharField(max_length=100, blank=True)


class StockAdjustment(TenantAwareModel):
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='adjustments')
    date = models.DateField(default=timezone.now)
    counted_quantity = models.IntegerField()
    difference = models.IntegerField(help_text="Calculated as counted - system quantity")
    reason = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, default='draft', choices=[
        ('draft', 'Draft'),
        ('validated', 'Validated')
    ])

class ReorderRule(TenantAwareModel):
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='reorder_rules')
    min_quantity = models.IntegerField(default=0)
    max_quantity = models.IntegerField(default=0)
    multiple_quantity = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)


class StockLot(TenantAwareModel):
    """Lot/serial number tracking"""
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='lots')
    name = models.CharField(max_length=100, help_text="Lot or serial number")
    expiry_date = models.DateField(null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

class StorageLocation(TenantAwareModel):
    """Multi-location warehouse storage zones"""
    name = models.CharField(max_length=100)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='locations')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    location_type = models.CharField(max_length=20, choices=[('supplier','Vendor Location'),('internal','Internal'),('customer','Customer'),('scrap','Scrap'),('transit','Transit')], default='internal')
    is_active = models.BooleanField(default=True)

class StockPicking(TenantAwareModel):
    """Transfer/picking operation (Receipt, Delivery, Internal Transfer)"""
    name = models.CharField(max_length=100)
    picking_type = models.CharField(max_length=20, choices=[('receipt','Receipt'),('delivery','Delivery'),('internal','Internal Transfer'),('return','Return')], default='receipt')
    origin_location = models.ForeignKey(StorageLocation, on_delete=models.SET_NULL, null=True, related_name='outgoing_pickings')
    dest_location = models.ForeignKey(StorageLocation, on_delete=models.SET_NULL, null=True, related_name='incoming_pickings')
    state = models.CharField(max_length=20, choices=[('draft','Draft'),('confirmed','Ready'),('done','Done'),('cancel','Cancelled')], default='draft')
    origin = models.CharField(max_length=100, blank=True)
    scheduled_date = models.DateTimeField(null=True, blank=True)
