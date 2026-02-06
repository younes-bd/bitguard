from django.db import models
from django.conf import settings

class Client(models.Model):
    """
    Central business entity. Can be a Company (B2B) or Individual (B2C).
    Links to Platform Workspaces and Store Orders.
    """
    TYPE_CHOICES = [
        ('company', 'Company (B2B)'),
        ('individual', 'Individual (B2C)'),
    ]
    STATUS_CHOICES = [
        ('lead', 'Lead'),
        ('prospect', 'Prospect'),
        ('active', 'Active'),
        ('churned', 'Churned'),
    ]
    SLA_CHOICES = [
        ('bronze', 'Bronze (8h)'),
        ('silver', 'Silver (4h)'),
        ('gold', 'Gold (1h)'),
        ('platinum', 'Platinum (15m)'),
    ]
    
    # Basic Info
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='clients', null=True, blank=True)
    name = models.CharField(max_length=200, help_text="Display name (e.g. Acme Corp or John Doe)")
    client_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='company')
    company_name = models.CharField(max_length=200, blank=True, help_text="Required for B2B")
    
    # Management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='lead')
    sla_level = models.CharField(max_length=20, choices=SLA_CHOICES, default='bronze')
    account_manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='managed_clients')
    
    # Contact Info
    website = models.URLField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.status})"

class Contact(models.Model):
    """
    Person associated with a Client.
    Can be linked to a User account for Portal access.
    """
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contacts')
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='contact_profile')
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=100, help_text="Job Title")
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Deal(models.Model):
    """
    Sales Opportunity / Deal tracking.
    """
    STAGE_CHOICES = [
        ('new', 'New Opportunity'),
        ('qualified', 'Qualified'),
        ('proposal', 'Proposal Sent'),
        ('negotiation', 'Negotiation'),
        ('won', 'Closed Won'),
        ('lost', 'Closed Lost'),
    ]
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='deals')
    name = models.CharField(max_length=200)
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='new')
    probability = models.IntegerField(default=10, help_text="Probability of closing (%)")
    expected_close_date = models.DateField(null=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='deals')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.get_stage_display()}"

class Interaction(models.Model):
    """
    Log of communications (Calls, Emails, Meetings) with a Client.
    """
    TYPE_CHOICES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
    ]
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='interactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    interaction_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='note')
    summary = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"{self.get_interaction_type_display()}: {self.summary}"

class Contract(models.Model):
    """
    Legal/Billing agreement.
    Links to Store Subscription for automated billing.
    """
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contracts')
    subscription = models.ForeignKey('store.Subscription', on_delete=models.SET_NULL, null=True, blank=True, related_name='crm_contracts')
    
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    document = models.FileField(upload_to='contracts/', blank=True, null=True) # Encrypt in production
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.client.name}"

class Ticket(models.Model):
    """
    Unified Ticket for Support and Security Incidents.
    Links to Platform Alerts for technical context.
    """
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('waiting_client', 'Waiting for Client'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    TYPE_CHOICES = [
        ('support', 'General Support'),
        ('incident', 'Security Incident'),
        ('access', 'Access Request'),
        ('billing', 'Billing Inquiry'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='tickets')
    linked_alert = models.ForeignKey('security.SecurityAlert', on_delete=models.SET_NULL, null=True, blank=True, related_name='crm_tickets')
    
    summary = models.CharField(max_length=200)
    description = models.TextField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    ticket_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='support')
    
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='assigned_tickets')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_tickets')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sla_due_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"[{self.get_ticket_type_display()}] {self.summary}"

class Project(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
    ]
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress = models.IntegerField(default=0, help_text="Percentage 0-100")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.client.name}"

class ActivityLog(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']

class Quote(models.Model):
    """
    Formal offer to a Client, often required for B2B deals.
    Can be converted to an Invoice (Proforma) or Contract.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent to Client'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
        ('converted', 'Converted'), # Converted to Invoice/Contract
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='quotes')
    deal = models.ForeignKey(Deal, on_delete=models.SET_NULL, null=True, blank=True, related_name='quotes')
    
    quote_number = models.CharField(max_length=50, unique=True, default='DRAFT')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    issue_date = models.DateField(auto_now_add=True)
    valid_until = models.DateField(null=True, blank=True)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    notes = models.TextField(blank=True, help_text="Terms and Conditions")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quote_number} - {self.client.name}"

    def save(self, *args, **kwargs):
        # Auto-gen Request Number
        if self.quote_number == 'DRAFT':
            # Save first to get PK if needed, or use timestamp
            import uuid
            self.quote_number = f"Q-{uuid.uuid4().hex[:8].upper()}"
        
        # Auto-calc totals
        if self.pk:
            self.subtotal = sum(item.amount for item in self.items.all())
            # Ensure tax is Decimal
            from decimal import Decimal
            if not isinstance(self.tax, Decimal):
                self.tax = Decimal(str(self.tax))
            self.total = self.subtotal + self.tax
        super().save(*args, **kwargs)

class QuoteItem(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('store.Product', on_delete=models.SET_NULL, null=True, related_name='quote_items')
    
    description = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    def save(self, *args, **kwargs):
        if self.product:
            if not self.description:
                self.description = self.product.name
            if not self.unit_price:
                self.unit_price = self.product.price
        
        self.amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.description} x{self.quantity}"
