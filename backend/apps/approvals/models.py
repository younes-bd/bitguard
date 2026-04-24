from django.db import models
from django.conf import settings
from apps.core.models import TenantAwareModel, TimeStampedModel, UUIDPrimaryKeyModel

class ApprovalRequest(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    )
    
    TYPE_CHOICES = (
        ('purchase', 'Purchase Order'),
        ('leave', 'Leave Request'),
        ('expense', 'Expense Claim'),
        ('access', 'Access Request'),
        ('contract', 'Contract Sign-Off'),
        ('other', 'Other'),
    )

    title = models.CharField(max_length=255)
    request_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='other')
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requested_approvals')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payload = models.JSONField(blank=True, null=True, help_text="Metadata or form context for the request")
    
    decided_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='decided_approvals')
    decided_at = models.DateTimeField(null=True, blank=True)
    comments = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"


class ApprovalStep(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    approval_request = models.ForeignKey(ApprovalRequest, on_delete=models.CASCADE, related_name='steps')
    step_order = models.PositiveIntegerField(default=1)
    approver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pending_approval_steps')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    decided_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['step_order']
        unique_together = ('approval_request', 'step_order')

    def __str__(self):
        return f"Step {self.step_order} for {self.approval_request.title}"
