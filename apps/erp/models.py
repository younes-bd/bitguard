from django.db import models
from django.conf import settings
from apps.crm.models import Client

# ==============================================================================
# MODULE 1: OPERATIONS OVERVIEW
# ==============================================================================

class OperationKPI(models.Model):
    """
    Real-time operational health metrics.
    Display high-level status on the ERP Overview.
    """
    CATEGORY_CHOICES = [
        ('sla', 'SLA Health'),
        ('incidents', 'Active Incidents'),
        ('resource', 'Resource Utilization'),
        ('compliance', 'Compliance Status'),
    ]
    STATUS_CHOICES = [
        ('healthy', 'Healthy'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    value = models.CharField(max_length=100, help_text="Current value (e.g., '98%')")
    detail = models.TextField(blank=True, help_text="Context or explanation")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='healthy')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.status})"

    @property
    def color_class(self):
        if self.status == 'healthy': return 'text-green'
        if self.status == 'warning': return 'text-yellow'
        return 'text-red'

    @property
    def bg_color_class(self):
        if self.status == 'healthy': return 'bg-green-500' # Assuming tailwind/platform classes
        if self.status == 'warning': return 'bg-yellow-500'
        return 'bg-red-500'

    @property # For the inline style logic replacement
    def progress_color_hex(self):
        if self.status == 'healthy': return '#22c55e'
        if self.status == 'warning': return '#eab308'
        return '#ef4444'

    @property
    def progress_width(self):
        if self.status == 'healthy': return 95
        if self.status == 'warning': return 70
        return 40

# ==============================================================================
# MODULE 2: PROJECTS & SERVICE DELIVERY
# ==============================================================================

class Service(models.Model):
    """
    Catalog of standard services offered by BitGuard.
    """
    SERVICE_TYPES = [
        ('subscription', 'Subscription'),
        ('project', 'One-Time Project'),
        ('hourly', 'Hourly/Retainer'),
    ]

    name = models.CharField(max_length=100)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='services', null=True, blank=True)
    description = models.TextField(blank=True)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES, default='project')
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class InternalProject(models.Model):
    """
    Internal project record, tightly linked to CRM Client.
    Manages delivery, timelines, and resources.
    """
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='internal_projects')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='internal_projects', null=True, blank=True)
    contract = models.ForeignKey('crm.Contract', on_delete=models.SET_NULL, null=True, blank=True, related_name='execution_projects', help_text="Linked Legal Contract")
    crm_project = models.OneToOneField('crm.Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='execution_data')
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    service_type = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='managed_projects')
    team = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_projects', blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    start_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    
    # Financials
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Total Contract Value")
    budget_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Total Internal Budget")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def profit_amount(self):
        return self.revenue - self.budget_cost

    @property
    def profit_margin(self):
        if self.revenue > 0:
            return ((self.revenue - self.budget_cost) / self.revenue) * 100
        return 0

    def __str__(self):
        return f"{self.name} - {self.client.name}"

class Milestone(models.Model):
    project = models.ForeignKey(InternalProject, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=200)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} ({self.project.name})"

# ==============================================================================
# MODULE 3: TASKS & WORKFORCE
# ==============================================================================

class EmployeeProfile(models.Model):
    """
    Extended profile for all staff members (Employees).
    """
    SENIORITY_CHOICES = [
        ('junior', 'Junior'),
        ('mid', 'Mid-Level'),
        ('senior', 'Senior'),
        ('principal', 'Principal'),
        ('director', 'Director'),
        ('c-level', 'C-Level'),
    ]

    DEPARTMENTS = [
        ('engineering', 'Engineering'),
        ('design', 'Design'),
        ('product', 'Product'),
        ('sales', 'Sales'),
        ('marketing', 'Marketing'),
        ('hr', 'HR'),
        ('finance', 'Finance'),
        ('legal', 'Legal'),
        ('executive', 'Executive'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee_profile')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='employees', null=True, blank=True)
    job_title = models.CharField(max_length=100, default='Employee')
    department = models.CharField(max_length=20, choices=DEPARTMENTS, default='engineering')
    
    seniority = models.CharField(max_length=20, choices=SENIORITY_CHOICES, default='mid')
    skills = models.TextField(help_text="Comma-separated list of skills", blank=True)
    
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, default='Remote', help_text="e.g. New York, London, Remote")
    start_date = models.DateField(null=True, blank=True)

    is_available = models.BooleanField(default=True)
    current_load = models.IntegerField(default=0, help_text="Current workload percentage (0-100)")
    
    # Financials (Phase 2)
    internal_cost_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, help_text="Hourly cost to company (Salary + Overhead)")

    def __str__(self):
        return f"{self.user.username} - {self.job_title}"
    
    @property
    def load_color_class(self):
        """Returns the CSS class for the progress bar based on load."""
        if self.current_load > 80:
            return 'fill-red'
        elif self.current_load > 50:
            return 'fill-yellow'
        return 'fill-green'

    @property
    def skill_list(self):
        if not self.skills:
            return []
        return [s.strip() for s in self.skills.split(',') if s.strip()]

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'In Review'),
        ('done', 'Done'),
    ]

    project = models.ForeignKey(InternalProject, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='erp_tasks')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    actual_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class TimeLog(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='timelogs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hours = models.DecimalField(max_digits=4, decimal_places=2)
    date = models.DateField()
    notes = models.TextField(blank=True)
    
    # Financials
    cost_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Calculated: Hours * Employee Rate")

    def save(self, *args, **kwargs):
        # Auto-calculate cost based on employee's current rate
        if not self.cost_amount and hasattr(self.user, 'employee_profile'):
            rate = self.user.employee_profile.internal_cost_rate
            self.cost_amount = self.hours * rate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.hours}h on {self.task.title}"

# ==============================================================================
# MODULE 4: ASSETS & INVENTORY
# ==============================================================================

class Asset(models.Model):
    TYPE_CHOICES = [
        ('laptop', 'Laptop/Workstation'),
        ('server', 'Server'),
        ('mobile', 'Mobile Device'),
        ('peripheral', 'Peripheral'),
        ('license', 'Software License'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('maintenance', 'In Maintenance'),
        ('retired', 'Retired'),
    ]

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='assets', null=True, blank=True)
    name = models.CharField(max_length=200)
    asset_tag = models.CharField(max_length=50, unique=True)
    asset_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    serial_number = models.CharField(max_length=100, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    assigned_to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_assets')
    assigned_to_client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_assets')
    
    purchase_date = models.DateField(null=True, blank=True)
    warranty_expiry = models.DateField(null=True, blank=True)
    
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.asset_tag})"

# ==============================================================================
# MODULE 5: VENDORS
# ==============================================================================

class Vendor(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='vendors', null=True, blank=True)
    name = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    service_provided = models.CharField(max_length=200, help_text="e.g. AWS, Microsoft, Splunk")
    
    def __str__(self):
        return self.name

class VendorContract(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='contracts')
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    document = models.FileField(upload_to='vendor_contracts/', blank=True, null=True)
    auto_renew = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} - {self.vendor.name}"

# ==============================================================================
# MODULE 6: COMPLIANCE & RISK
# ==============================================================================

class RiskRegister(models.Model):
    PROBABILITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    IMPACT_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('severe', 'Severe'),
    ]
    
    summary = models.CharField(max_length=255)
    description = models.TextField()
    probability = models.CharField(max_length=10, choices=PROBABILITY_CHOICES)
    impact = models.CharField(max_length=10, choices=IMPACT_CHOICES)
    mitigation_plan = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, default='identified')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.summary

class ComplianceItem(models.Model):
    """
    Track adherence to specific compliance requirements (ISO 27001 control, SOC2 criteria).
    """
    STATUS_CHOICES = [
        ('compliant', 'Compliant'),
        ('non_compliant', 'Non-Compliant'),
        ('partial', 'Partial'),
        ('not_applicable', 'N/A'),
    ]
    
    control_id = models.CharField(max_length=50, help_text="e.g. A.5.1.1")
    description = models.TextField()
    framework = models.CharField(max_length=100, default='ISO 27001')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='partial')
    last_audit_date = models.DateField(null=True, blank=True)
    next_audit_date = models.DateField(null=True, blank=True)
    evidence_link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.framework} - {self.control_id}"

# ==============================================================================
# MODULE 7: FINANCIALS (INVOICES)
# ==============================================================================

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('proforma', 'Proforma'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='invoices')
    project = models.ForeignKey(InternalProject, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    contract = models.ForeignKey('crm.Contract', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices', help_text="Linked Contract for Billing")
    order = models.OneToOneField('store.Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoice')
    
    invoice_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    issue_date = models.DateField()
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, blank=True)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, blank=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, blank=True)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # 1. Update Totals (Auto-calc from items if they exist)
        if self.pk and self.items.exists():
            self.subtotal = sum(item.amount for item in self.items.all())
            self.total = self.subtotal + self.tax
        
        # If new or no items, we trust the manual input from the form
        # Ensure total is calculated if not provided but subtotal is
        elif not self.total and self.subtotal:
             self.total = self.subtotal + self.tax

        # 2. Check for Status Change to PAID/SENT (Deduct Stock)
        if self.pk:
            old_instance = Invoice.objects.filter(pk=self.pk).first()
            if old_instance and old_instance.status not in ['paid', 'sent'] and self.status in ['paid', 'sent']:
                self._deduct_stock()

        super().save(*args, **kwargs)

    def _deduct_stock(self):
        for item in self.items.all():
            if item.product and item.product.track_stock:
                item.product.stock_quantity -= int(item.quantity)
                item.product.save()

    def __str__(self):
        return f"{self.invoice_number} - {self.client.name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('store.Product', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    def save(self, *args, **kwargs):
        # Auto-fill from Product if available
        if self.product:
            if not self.description:
                self.description = self.product.name
            if not self.unit_price:
                self.unit_price = self.product.price
                
        self.amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} ({self.amount})"

# ==============================================================================
# MODULE 9: SYSTEMS & INTEGRATIONS
# ==============================================================================

class Integration(models.Model):
    SERVICE_CHOICES = [
        ('stripe', 'Stripe'),
        ('slack', 'Slack'),
        ('github', 'GitHub'),
        ('aws', 'AWS'),
        ('sentry', 'Sentry'),
        ('jira', 'Jira'),
        ('google', 'Google Workspace'),
    ]

    name = models.CharField(max_length=50, choices=SERVICE_CHOICES, unique=True)
    api_key = models.CharField(max_length=255, blank=True, help_text="API Key or Secret Token")
    webhook_url = models.URLField(blank=True, help_text="Webhook Endpoint for callbacks")
    is_active = models.BooleanField(default=False)
    connected_at = models.DateTimeField(null=True, blank=True)
    last_sync = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_name_display()} Integration"

    @property
    def icon_class(self):
        icons = {
            'stripe': 'fab fa-stripe-s',
            'slack': 'fab fa-slack',
            'github': 'fab fa-github',
            'aws': 'fab fa-aws',
            'sentry': 'fas fa-bug',
            'jira': 'fab fa-jira',
            'google': 'fab fa-google',
        }
        return icons.get(self.name, 'fas fa-plug')

class Expense(models.Model):
    """
    One-off expenses (e.g. Travel, Office Supplies, Software Subscriptions).
    """
    CATEGORY_CHOICES = [
        ('software', 'Software/SaaS'),
        ('hardware', 'Hardware'),
        ('office', 'Office Supplies'),
        ('travel', 'Travel & Meals'),
        ('marketing', 'Marketing/Ads'),
        ('contractor', 'Contractor/Freelancer'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),
    ]

    project = models.ForeignKey(InternalProject, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='submitted_expenses')
    
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    
    receipt = models.FileField(upload_to='receipts/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - ${self.amount}"

class VendorBill(models.Model):
    """
    Bills received from Vendors (Accounts Payable).
    """
    STATUS_CHOICES = [
        ('received', 'Received'),
        ('scheduled', 'Scheduled for Payment'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='bills')
    bill_number = models.CharField(max_length=50) # Vendor's invoice number
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    issue_date = models.DateField()
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    attachment = models.FileField(upload_to='vendor_bills/', blank=True, null=True)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bill #{self.bill_number} - {self.vendor.name}"

class Policy(models.Model):
    """
    Company Policies and Procedures (e.g. Acceptable Use Policy).
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('review', 'In Review'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Markdown or HTML content")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    version = models.CharField(max_length=20, default='1.0')
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='owned_policies')
    last_review_date = models.DateField(null=True, blank=True)
    next_review_date = models.DateField(null=True, blank=True)
    
    document = models.FileField(upload_to='policies/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (v{self.version})"
