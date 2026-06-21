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

class ServiceCategory(TenantAwareModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, default='HelpCircle')
    color = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subcategories')

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name

class ServiceItem(TenantAwareModel):
    name = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='HelpCircle')
    category = models.ForeignKey('ServiceCategory', on_delete=models.SET_NULL, null=True, blank=True)
    sku = models.CharField(max_length=50, unique=True, null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pricing_type = models.CharField(max_length=20, choices=[
        ('free', 'Free'), ('one_time', 'One-Time'), ('monthly', 'Monthly'),
        ('annual', 'Annual'), ('per_seat', 'Per Seat')
    ], default='free')
    billing_cycle = models.CharField(max_length=20, choices=[
        ('one_time','One-Time'),('monthly','Monthly'),('quarterly','Quarterly'),('annual','Annual')
    ], null=True, blank=True)
    estimated_fulfillment_hours = models.IntegerField(null=True, blank=True)
    visibility = models.CharField(max_length=20, choices=[
        ('internal','Internal Only'),('client','Client-Facing'),('self_service','Self-Service Portal')
    ], default='internal')
    dynamic_form_schema = models.JSONField(default=dict, blank=True)
    sort_order = models.IntegerField(default=0)
    tags = models.CharField(max_length=500, blank=True)
    is_featured = models.BooleanField(default=False)
    deprecation_date = models.DateField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    sla_tier = models.ForeignKey('contracts.SLATier', on_delete=models.SET_NULL, null=True, blank=True, related_name='service_items')
    approval_required = models.BooleanField(default=False)
    service_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_services')
    linked_product = models.ForeignKey('store.Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='itsm_services', help_text="Link to Master Catalog for billable tickets")

    def __str__(self):
        return self.name

class ServiceRequest(TenantAwareModel):
    STATUS_CHOICES = [
        ('pending_approval', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]
    service_item = models.ForeignKey(ServiceItem, on_delete=models.CASCADE, related_name='requests')
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='service_requests')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending_approval')
    
    department_code = models.CharField(max_length=50, blank=True)
    urgency = models.CharField(max_length=20, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')], default='medium')
    impact = models.CharField(max_length=20, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium')
    due_date = models.DateTimeField(null=True, blank=True)

    form_data = models.JSONField(default=dict, blank=True)
    ticket = models.OneToOneField('support.Ticket', on_delete=models.SET_NULL, null=True, blank=True, related_name='service_request')
    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"REQ-{self.pk}: {self.service_item.name} by {self.requester.username}"

