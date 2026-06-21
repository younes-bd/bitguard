from django.db import models
from apps.core.models import TenantAwareModel
from django.conf import settings

class POSConfig(TenantAwareModel):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    receipt_header = models.TextField(blank=True)
    receipt_footer = models.TextField(blank=True)

    def __str__(self):
        return self.name

class POSSession(TenantAwareModel):
    config = models.ForeignKey(POSConfig, on_delete=models.CASCADE, related_name='sessions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_at = models.DateTimeField(auto_now_add=True)
    stop_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('opened', 'In Progress'), ('closed', 'Closed')], default='opened')
    cash_register_balance_start = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cash_register_balance_end_real = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Session {self.id} - {self.config.name}"

class POSOrder(TenantAwareModel):
    session = models.ForeignKey(POSSession, on_delete=models.CASCADE, related_name='orders')
    date_order = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    client = models.ForeignKey('crm.Client', on_delete=models.SET_NULL, null=True, blank=True)
    amount_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_return = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=[('draft', 'New'), ('paid', 'Paid'), ('done', 'Posted'), ('invoiced', 'Invoiced')], default='draft')
    receipt_number = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.receipt_number

class POSOrderLine(TenantAwareModel):
    order = models.ForeignKey(POSOrder, on_delete=models.CASCADE, related_name='lines')
    product = models.ForeignKey('store.Product', on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    price_unit = models.DecimalField(max_digits=12, decimal_places=2)
    price_subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    price_subtotal_incl = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.qty} x {self.product.name}"

class POSPayment(TenantAwareModel):
    order = models.ForeignKey(POSOrder, on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} via {self.payment_method}"
