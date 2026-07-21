from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class Vehicle(TenantAwareModel):
    name = models.CharField(max_length=255, default='')
    license_plate = models.CharField(max_length=50, default='')
    driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='driven_vehicles')
    state = models.CharField(max_length=20, choices=[('active', 'Active'), ('in_repair', 'In Repair'), ('retired', 'Retired')], default='active')
    odometer = models.FloatField(default=0.0)
    acquisition_date = models.DateField(null=True, blank=True)

    class Meta:
        app_label = 'fleet'

class VehicleLog(TenantAwareModel):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='logs')
    log_type = models.CharField(max_length=50, choices=[('service', 'Service'), ('odometer', 'Odometer'), ('fuel', 'Fuel')], default='service')
    date = models.DateField(auto_now_add=True)
    description = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    class Meta:
        app_label = 'fleet'

class VehicleContract(TenantAwareModel):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='contracts')
    insurer = models.CharField(max_length=255, default='', blank=True)
    start_date = models.DateField(null=True, blank=True)
    expiration_date = models.DateField(null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    state = models.CharField(max_length=20, default='open')

    class Meta:
        app_label = 'fleet'
