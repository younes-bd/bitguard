from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class QualityAlert(TenantAwareModel):
    name = models.CharField(max_length=255)
    product_id = models.IntegerField(help_text="Reference to inventory product")
    team_id = models.IntegerField(help_text="Reference to Quality Team")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=[('0', 'Normal'), ('1', 'Low'), ('2', 'High'), ('3', 'Very High')], default='0')
    state = models.CharField(max_length=20, choices=[('draft', 'Draft'), ('confirmed', 'Confirmed'), ('action', 'Action Proposed'), ('close', 'Closed')], default='draft')

    class Meta:
        app_label = 'quality_control'

class QualityPoint(TenantAwareModel):
    """Quality control point — a checkpoint in the production flow."""
    title = models.CharField(max_length=200)
    operation = models.CharField(
        max_length=50,
        choices=[('incoming', 'Incoming'), ('outgoing', 'Outgoing'), ('manufacturing', 'Manufacturing')],
        default='incoming'
    )
    team = models.CharField(max_length=100, blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        app_label = 'quality_control'

class QualityCheck(TenantAwareModel):
    """An actual quality check instance."""
    point = models.ForeignKey(QualityPoint, on_delete=models.CASCADE, related_name='checks')
    lot_name = models.CharField(max_length=50, blank=True)
    result = models.CharField(
        max_length=20,
        choices=[('none', 'To Do'), ('pass', 'Pass'), ('fail', 'Fail')],
        default='none'
    )
    note = models.TextField(blank=True)

    class Meta:
        app_label = 'quality_control'
