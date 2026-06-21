from django.db import models
from apps.core.models import TenantAwareModel
from django.conf import settings

class Vehicle(TenantAwareModel):
    model_name = models.CharField(max_length=100)
    license_plate = models.CharField(max_length=50, unique=True)
    vin_sn = models.CharField(max_length=100, blank=True)
    driver = models.ForeignKey('hrm.Employee', on_delete=models.SET_NULL, null=True, blank=True)
    acquisition_date = models.DateField(null=True, blank=True)
    odometer = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=50, choices=[
        ('active', 'Active'),
        ('ordered', 'Ordered'),
        ('registered', 'Registered'),
        ('downgraded', 'Downgraded'),
        ('reserve', 'Reserve'),
    ], default='active')

    def __str__(self):
        return f"{self.model_name} / {self.license_plate}"

class VehicleLog(TenantAwareModel):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField(auto_now_add=True)
    odometer_value = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    driver = models.ForeignKey('hrm.Employee', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.odometer_value} km"

class VehicleContract(TenantAwareModel):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='contracts')
    insurer_id = models.CharField(max_length=100, blank=True)
    start_date = models.DateField()
    expiration_date = models.DateField()
    cost_generated = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_frequency = models.CharField(max_length=20, choices=[
        ('no', 'No'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly')
    ], default='monthly')

    def __str__(self):
        return f"Contract for {self.vehicle.license_plate}"
