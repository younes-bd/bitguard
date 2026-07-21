from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel

class AppointmentType(TenantAwareModel):
    name = models.CharField(max_length=255)
    duration = models.FloatField(help_text="Duration in hours", default=1.0)
    location = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class AppointmentResource(TenantAwareModel):
    name = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=50, choices=[('human', 'Human'), ('material', 'Material')], default='human')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointment_resources')
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Appointment(TenantAwareModel):
    title = models.CharField(max_length=255)
    appointment_type = models.ForeignKey(AppointmentType, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    resource = models.ForeignKey(AppointmentResource, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    scheduled_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='draft', choices=[
        ('draft', 'Draft'), 
        ('scheduled', 'Scheduled'), 
        ('completed', 'Completed'), 
        ('cancelled', 'Cancelled')
    ])
    attendees = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='attended_appointments', blank=True)

    def __str__(self):
        return self.title
