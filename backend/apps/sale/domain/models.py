from django.db import models
from django.utils import timezone
from apps.core.models import TenantAwareModel
from django.conf import settings

class SaleOrder(TenantAwareModel):
    STATUS_CHOICES = [
        ('draft', 'Quotation'),
        ('sent', 'Quotation Sent'),
        ('sale', 'Sales Order'),
        ('done', 'Locked'),
        ('cancel', 'Cancelled'),
    ]
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE, related_name='sale_orders')
    order_number = models.CharField(max_length=100)
    date_order = models.DateField(default=timezone.now)
    validity_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    amount_untaxed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Sale Order'
        unique_together = ('tenant', 'order_number')

    def __str__(self):
        return self.order_number

class SaleOrderLine(TenantAwareModel):
    order = models.ForeignKey(SaleOrder, on_delete=models.CASCADE, related_name='lines')
    product = models.ForeignKey('store.Product', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.TextField(help_text="Description")
    product_uom_qty = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    price_unit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    price_subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    analytic_account = models.ForeignKey('accounting.AnalyticAccount', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Sale Order Line'

    def __str__(self):
        return f"{self.order.order_number} - {self.name}"
