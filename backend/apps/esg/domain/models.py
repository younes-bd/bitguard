from django.db import models
from apps.core.domain.models import TenantAwareModel

class EsgMetric(TenantAwareModel):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100) # e.g. Environmental, Social
    value = models.DecimalField(max_digits=15, decimal_places=4)
    unit = models.CharField(max_length=50)
    measured_date = models.DateField()

    def __str__(self):
        return f"{self.name} ({self.value} {self.unit})"

class EsgTarget(TenantAwareModel):
    metric_name = models.CharField(max_length=255)
    target_value = models.DecimalField(max_digits=15, decimal_places=4)
    target_date = models.DateField()

    def __str__(self):
        return f"{self.metric_name} Target"
