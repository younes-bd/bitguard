from django.db import models
from apps.core.domain.models import TenantAwareModel

class DeliveryNote(TenantAwareModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('returned', 'Returned'),
    ]
    dn_number = models.CharField(max_length=100)
    invoice = models.ForeignKey('accounting.Invoice', on_delete=models.SET_NULL, null=True, blank=True, related_name='delivery_notes')
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE)
    shipping_address = models.TextField()
    tracking_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    delivery_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'dn_number')

    def __str__(self):
        return self.dn_number

class ShippingMethod(TenantAwareModel):
    PROVIDER_CHOICES = [
        ('fixed', 'Fixed Price'),
        ('rules', 'Based on Rules'),
        ('free', 'Free Delivery'),
    ]
    name = models.CharField(max_length=100)
    provider_type = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default='fixed')
    fixed_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    active = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
