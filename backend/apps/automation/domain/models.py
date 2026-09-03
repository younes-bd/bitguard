from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.domain.models import TenantAwareModel

class AutomatedAction(TenantAwareModel):
    """
    Event-driven workflow automation rule.
    Odoo base_automation equivalent.

    Example: "When a Ticket's priority changes to Critical, send an email to the manager."
    """
    TRIGGER_CHOICES = [
        ('on_create', 'On Record Creation'),
        ('on_write', 'On Record Update'),
        ('on_unlink', 'On Record Deletion'),
        ('on_stage_set', 'When Stage Is Set To'),
        ('on_time', 'Based on Time Condition'),
    ]
    ACTION_TYPE_CHOICES = [
        ('update_field', 'Update a Field'),
        ('send_email', 'Send Email'),
        ('send_notification', 'Send In-App Notification'),
        ('create_activity', 'Schedule Activity'),
        ('call_webhook', 'Call External Webhook'),
    ]
    name = models.CharField(max_length=255)
    model_name = models.CharField(max_length=100, help_text="e.g. crm.Lead, helpdesk.Ticket")
    trigger = models.CharField(max_length=30, choices=TRIGGER_CHOICES)
    filter_domain = models.JSONField(default=dict, blank=True)
    action_type = models.CharField(max_length=30, choices=ACTION_TYPE_CHOICES)
    action_data = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    last_run = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'automation_automatedaction'
        app_label = 'automation'
        verbose_name = _('Automated Action')
        verbose_name_plural = _('Automated Actions')

    def __str__(self):
        return f"{self.name} ({self.model_name})"
