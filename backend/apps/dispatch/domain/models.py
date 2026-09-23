from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel

class FieldIntervention(TenantAwareModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    scheduled_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='pending', choices=[
        ('pending', 'Pending'), ('in_progress', 'In Progress'), ('done', 'Done'), ('cancelled', 'Cancelled')
    ])
    technician = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='interventions')
    location_address = models.CharField(max_length=500, blank=True)
    
    def __str__(self):
        return self.title
