from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class PosConfig(TenantAwareModel):
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    receipt_header = models.TextField(blank=True)
    is_restaurant = models.BooleanField(default=False, help_text="Enable Restaurant/Bar features (Floors, Tables)")

    class Meta:
        app_label = 'pos'

class RestaurantPrinter(TenantAwareModel):
    name = models.CharField(max_length=100)
    printer_type = models.CharField(max_length=50, choices=[('network', 'Network Printer'), ('bluetooth', 'Bluetooth Printer'), ('usb', 'USB Printer')], default='network')
    ip_address = models.CharField(max_length=50, blank=True)
    config = models.ForeignKey(PosConfig, on_delete=models.CASCADE, related_name='printers')

    class Meta:
        app_label = 'pos'

class RestaurantFloor(TenantAwareModel):
    name = models.CharField(max_length=100)
    config = models.ForeignKey(PosConfig, on_delete=models.CASCADE, related_name='floors')
    background_color = models.CharField(max_length=20, default='rgba(235, 236, 240, 1)')
    sequence = models.IntegerField(default=10)

    class Meta:
        app_label = 'pos'

class RestaurantTable(TenantAwareModel):
    name = models.CharField(max_length=50)
    floor = models.ForeignKey(RestaurantFloor, on_delete=models.CASCADE, related_name='tables')
    seats = models.IntegerField(default=1)
    position_x = models.IntegerField(default=0, help_text="X Coordinate for Floor Plan")
    position_y = models.IntegerField(default=0, help_text="Y Coordinate for Floor Plan")
    width = models.IntegerField(default=50)
    height = models.IntegerField(default=50)
    shape = models.CharField(max_length=20, choices=[('square', 'Square'), ('round', 'Round')], default='square')

    class Meta:
        app_label = 'pos'


class PosSession(TenantAwareModel):
    config = models.ForeignKey(PosConfig, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_at = models.DateTimeField(auto_now_add=True)
    stop_at = models.DateTimeField(null=True, blank=True)
    state = models.CharField(max_length=20, choices=[('opening_control', 'Opening Control'), ('opened', 'In Progress'), ('closing_control', 'Closing Control'), ('closed', 'Closed')], default='opening_control')
    
    cash_register_balance_start = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    cash_register_balance_end_real = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    @property
    def cash_register_difference(self):
        # difference = real end balance - (start balance + cash payments in this session)
        cash_payments = sum(p.amount for o in self.orders.all() for p in o.payments.all() if p.payment_method == 'cash')
        expected = self.cash_register_balance_start + cash_payments
        return self.cash_register_balance_end_real - expected

    class Meta:
        app_label = 'pos'

class PosOrder(TenantAwareModel):
    session = models.ForeignKey(PosSession, on_delete=models.CASCADE, related_name='orders')
    date_order = models.DateTimeField(auto_now_add=True)
    amount_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    state = models.CharField(max_length=20, choices=[('draft', 'New'), ('paid', 'Paid'), ('done', 'Posted'), ('invoiced', 'Invoiced')], default='draft')

    class Meta:
        app_label = 'pos'

class PosPayment(TenantAwareModel):
    order = models.ForeignKey(PosOrder, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)

    class Meta:
        app_label = 'pos'
