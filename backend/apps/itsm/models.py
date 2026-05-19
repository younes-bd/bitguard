from django.db import models
from django.conf import settings
from apps.core.models import BaseModel, TenantAwareModel

class ChangeRequest(TenantAwareModel):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('rolled_back', 'Rolled Back'),
    )

    RISK_CHOICES = (
        ('low', 'Low Risk'),
        ('medium', 'Medium Risk'),
        ('high', 'High Risk'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requested_changes')
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    risk_level = models.CharField(max_length=20, choices=RISK_CHOICES, default='medium')
    
    implementation_plan = models.TextField(blank=True)
    rollback_plan = models.TextField(blank=True)
    
    scheduled_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_changes')

    def __str__(self):
        return f"CR-{self.pk}: {self.title}"

class Problem(TenantAwareModel):
    STATUS_CHOICES = (
        ('identified', 'Identified'),
        ('investigating', 'Investigating'),
        ('root_cause_identified', 'Root Cause Identified'),
        ('workaround_provided', 'Workaround Provided'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='identified')
    priority = models.CharField(max_length=20, choices=ChangeRequest.PRIORITY_CHOICES, default='medium')
    
    root_cause = models.TextField(blank=True)
    permanent_fix = models.TextField(blank=True)
    workaround = models.TextField(blank=True)
    
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_problems')
    
    # Links to other entities
    change_request = models.OneToOneField(ChangeRequest, on_delete=models.SET_NULL, null=True, blank=True, related_name='problem')

    def __str__(self):
        return f"PRB-{self.pk}: {self.title}"

class ChangeTask(TenantAwareModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    change_request = models.ForeignKey(ChangeRequest, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    

    def __str__(self):
        return f"Task: {self.title} (CR-{self.change_request.pk})"
