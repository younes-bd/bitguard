from django.db import models
from apps.core.models import TenantAwareModel

class WorkCenter(TenantAwareModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    cost_per_hour = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    capacity = models.DecimalField(max_digits=10, decimal_places=2, default=1.0)
    time_efficiency = models.DecimalField(max_digits=5, decimal_places=2, default=100.0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class BillOfMaterial(TenantAwareModel):
    product = models.ForeignKey('store.Product', on_delete=models.CASCADE, related_name='boms')
    reference = models.CharField(max_length=100, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1.0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"BOM for {self.product.name}"

class BOMComponent(TenantAwareModel):
    bom = models.ForeignKey(BillOfMaterial, on_delete=models.CASCADE, related_name='components')
    product = models.ForeignKey('store.Product', on_delete=models.CASCADE, related_name='+')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class ManufacturingOrder(TenantAwareModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('progress', 'In Progress'),
        ('done', 'Done'),
        ('cancel', 'Cancelled'),
    ]
    name = models.CharField(max_length=100, unique=True)
    product = models.ForeignKey('store.Product', on_delete=models.CASCADE, related_name='manufacturing_orders')
    bom = models.ForeignKey(BillOfMaterial, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    date_planned_start = models.DateTimeField()
    date_planned_finished = models.DateTimeField()
    
    def __str__(self):
        return self.name
