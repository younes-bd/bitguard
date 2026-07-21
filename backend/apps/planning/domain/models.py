from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel

class PlanningRole(TenantAwareModel):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=50, blank=True, help_text="Hex color or tailwind class")
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class ShiftTemplate(TenantAwareModel):
    name = models.CharField(max_length=255)
    role = models.ForeignKey(PlanningRole, on_delete=models.SET_NULL, null=True, blank=True, related_name='shift_templates')
    start_time = models.TimeField(null=True, blank=True)
    duration_hours = models.FloatField(default=8.0)

    def __str__(self):
        return self.name

class Shift(TenantAwareModel):
    title = models.CharField(max_length=255, blank=True)
    role = models.ForeignKey(PlanningRole, on_delete=models.SET_NULL, null=True, blank=True, related_name='shifts')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='shifts')
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    allocated_hours = models.FloatField(default=0.0)
    allocated_percentage = models.FloatField(default=100.0)
    status = models.CharField(max_length=50, default='draft', choices=[
        ('draft', 'Draft'), ('published', 'Published')
    ])
    
    def __str__(self):
        return self.title or f"Shift {self.id}"
