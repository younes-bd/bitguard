from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class WorkCenter(TenantAwareModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    capacity = models.FloatField(default=1.0)
    time_efficiency = models.FloatField(default=100.0)
    color = models.CharField(max_length=7, default='#3b82f6')
    is_active = models.BooleanField(default=True)
    costs_hour = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        app_label = 'mrp'

class Routing(TenantAwareModel):
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'mrp'

class RoutingOperation(TenantAwareModel):
    name = models.CharField(max_length=255)
    routing = models.ForeignKey(Routing, on_delete=models.CASCADE, related_name='operations')
    work_center = models.ForeignKey(WorkCenter, on_delete=models.SET_NULL, null=True)
    sequence = models.IntegerField(default=10)
    duration_expected = models.FloatField(default=60, help_text="Minutes")

    class Meta:
        app_label = 'mrp'

class BillOfMaterial(TenantAwareModel):
    product_id = models.IntegerField(help_text="Reference to inventory product", default=0, blank=True, null=True)
    code = models.CharField(max_length=50, blank=True)
    quantity = models.FloatField(default=1.0)
    type = models.CharField(max_length=20, choices=[('normal', 'Manufacture this product'), ('phantom', 'Kit')], default='normal')
    routing = models.ForeignKey(Routing, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'mrp'

class BillOfMaterialLine(TenantAwareModel):
    bom = models.ForeignKey(BillOfMaterial, on_delete=models.CASCADE, related_name='lines')
    component_id = models.IntegerField(help_text="FK to inventory.InventoryItem", default=0, blank=True, null=True)
    component_name = models.CharField(max_length=255, blank=True)
    quantity = models.FloatField(default=1.0)
    sequence = models.IntegerField(default=10)

    class Meta:
        app_label = 'mrp'

class ManufacturingOrder(TenantAwareModel):
    name = models.CharField(max_length=255, unique=True)
    product_id = models.IntegerField(help_text="Reference to inventory product", default=0, blank=True, null=True)
    bom = models.ForeignKey(BillOfMaterial, on_delete=models.SET_NULL, null=True, blank=True)
    qty_producing = models.FloatField(default=0.0)
    state = models.CharField(max_length=20, choices=[('draft', 'Draft'), ('confirmed', 'Confirmed'), ('in_progress', 'In Progress'), ('done', 'Done'), ('cancel', 'Cancelled')], default='draft')
    date_planned_start = models.DateTimeField(null=True, blank=True)
    
    product_name = models.CharField(max_length=255, blank=True)
    qty_to_produce = models.FloatField(default=1.0)
    date_planned_finished = models.DateTimeField(null=True, blank=True)
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    origin = models.CharField(max_length=100, blank=True, help_text="Source document (SO number)")
    lot_number = models.CharField(max_length=100, blank=True)
    routing = models.ForeignKey(Routing, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        app_label = 'mrp'

class WorkOrder(TenantAwareModel):
    """Individual operation step within a Manufacturing Order"""
    manufacturing_order = models.ForeignKey(ManufacturingOrder, on_delete=models.CASCADE, related_name='work_orders')
    operation = models.ForeignKey(RoutingOperation, on_delete=models.SET_NULL, null=True)
    work_center = models.ForeignKey(WorkCenter, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255)
    state = models.CharField(max_length=20, choices=[('pending','Pending'),('ready','Ready'),('in_progress','In Progress'),('done','Done'),('cancel','Cancelled')], default='pending')
    duration_expected = models.FloatField(default=60)
    duration_real = models.FloatField(default=0)
    date_start = models.DateTimeField(null=True, blank=True)
    date_finished = models.DateTimeField(null=True, blank=True)
    sequence = models.IntegerField(default=10)

    class Meta:
        app_label = 'mrp'

class ScrapOrder(TenantAwareModel):
    """Record of scrapped materials during production"""
    manufacturing_order = models.ForeignKey(ManufacturingOrder, on_delete=models.SET_NULL, null=True, blank=True)
    inventory_item_id = models.IntegerField(default=0, blank=True, null=True)
    component_name = models.CharField(max_length=255, blank=True)
    quantity = models.FloatField(default=1.0)
    reason = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)

    class Meta:
        app_label = 'mrp'
