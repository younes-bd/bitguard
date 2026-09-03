from django.db import models
from apps.core.domain.models import BaseModel, TenantAwareModel, ChatterMixin
from django.conf import settings


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# CRM CONFIGURATION MODELS (Odoo crm.stage, crm.team, crm.tag)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class CrmStage(TenantAwareModel):
    """
    Configurable CRM pipeline stage. Odoo crm.stage equivalent.

    Instead of hardcoding stages as CharField choices, stages are stored in
    the database so users can create/rename/reorder them from the Settings page
    without any code changes. The DealsPipeline Kanban reads from this model.
    """
    name = models.CharField(max_length=100)
    sequence = models.IntegerField(default=10, help_text="Lower = leftmost column in Kanban")
    is_won = models.BooleanField(
        default=False, help_text="Deals in this stage count as Closed Won"
    )
    is_lost = models.BooleanField(
        default=False, help_text="Deals in this stage count as Closed Lost"
    )
    fold = models.BooleanField(
        default=False, help_text="Fold this column in Kanban view by default"
    )
    probability = models.IntegerField(
        default=0, help_text="Default win probability (%) assigned to deals entering this stage"
    )
    color = models.CharField(max_length=7, default='#3b82f6', help_text="Hex color for Kanban column header")
    requirements = models.TextField(
        blank=True, help_text="Optional checklist or notes shown to the salesperson for this stage"
    )

    class Meta:
        app_label = 'crm'
        ordering = ['sequence']
        verbose_name = 'CRM Stage'
        verbose_name_plural = 'CRM Stages'

    def __str__(self):
        return self.name


class CrmSalesTeam(TenantAwareModel):
    """
    CRM Sales Team. Odoo crm.team equivalent.

    Groups salespeople together. Leads and deals can be assigned to a team.
    Each team can have its own email alias to auto-create leads.
    """
    name = models.CharField(max_length=100)
    leader = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='led_crm_teams'
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name='crm_teams'
    )
    alias_email = models.EmailField(
        blank=True, help_text="Inbound email alias â€” emails sent here auto-create leads"
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'crm'
        verbose_name = 'Sales Team'
        verbose_name_plural = 'Sales Teams'

    def __str__(self):
        return self.name


class LostReason(TenantAwareModel):
    """
    Reason why a deal was marked as lost. Odoo crm.lost.reason equivalent.
    Displayed as a dropdown when a user marks a deal as Closed Lost.
    """
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'crm'
        ordering = ['name']
        verbose_name = 'Lost Reason'
        verbose_name_plural = 'Lost Reasons'

    def __str__(self):
        return self.name


class CrmTag(TenantAwareModel):
    """CRM tags for categorizing leads and deals."""
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#6b7280')

    class Meta:
        app_label = 'crm'
        ordering = ['name']

    def __str__(self):
        return self.name


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# CORE CRM MODELS
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class Client(ChatterMixin, TenantAwareModel):
    """
    A customer/client in the CRM system.
    Charter Â§15: Every customer exists in a single lifecycle model.
    """
    STATUS_CHOICES = [
        ('prospect', 'Prospect'),
        ('active', 'Active Customer'),
        ('subscriber', 'Subscriber'),
        ('managed_service', 'Managed Service Client'),
        ('suspended', 'Suspended'),
        ('closed', 'Closed'),
    ]
    TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('business', 'Business'),
    ]
    name = models.CharField(max_length=255)
    partner = models.OneToOneField(
        'core.Partner', on_delete=models.CASCADE,
        null=True, blank=True, related_name='crm_client_profile'
    )
    client_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='business')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='prospect')
    industry = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_clients'
    )
    team = models.ForeignKey(
        CrmSalesTeam, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='clients'
    )

    class Meta:
        app_label = 'crm'
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.name


class Contact(TenantAwareModel):
    """A person at a Client company."""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contacts')
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='crm_contact'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=100, blank=True, help_text="e.g. Decision Maker, Champion")
    is_primary = models.BooleanField(default=False, help_text="Primary contact for the client")

    class Meta:
        app_label = 'crm'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Lead(ChatterMixin, TenantAwareModel):
    """
    Inbound lead / prospect. Odoo crm.lead equivalent.

    KEY FIX: Added first_name, last_name, company, email, phone, source fields
    to match what the frontend LeadList.jsx component expects.
    The `contact` FK is kept as an optional link for qualified leads.
    """
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('lost', 'Lost'),
        ('converted', 'Converted'),
    ]
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('cold_call', 'Cold Call'),
        ('event', 'Event'),
        ('social', 'Social Media'),
        ('partner', 'Partner'),
        ('ad', 'Advertising'),
        ('other', 'Other'),
    ]
    PRIORITY_CHOICES = [
        ('0', 'Normal'),
        ('1', 'Low'),
        ('2', 'High'),
        ('3', 'Very High'),
    ]

    # Lead/prospect information (denormalized â€” matches Odoo's crm.lead pattern)
    title = models.CharField(max_length=255, help_text="Opportunity or lead title")
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=255, blank=True, help_text="Prospect company name")
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='website')

    # UTM parameters for marketing tracking
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)

    # Qualification
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='new')
    value = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00,
        help_text="Estimated deal value if converted"
    )
    score = models.IntegerField(default=0, help_text="Lead score based on activity and profile")
    probability = models.IntegerField(
        default=10, help_text="Estimated win probability 0â€“100%"
    )
    priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='0')
    description = models.TextField(blank=True)
    expected_close_date = models.DateField(null=True, blank=True)
    lost_reason = models.CharField(max_length=255, blank=True)

    # Assignments
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_leads'
    )
    team = models.ForeignKey(
        CrmSalesTeam, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='leads'
    )
    tags = models.ManyToManyField(CrmTag, blank=True, related_name='leads')

    # Optional link to a Contact (set when lead is qualified)
    contact = models.ForeignKey(
        Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads'
    )
    # Optional link to a Client (set when lead is converted)
    client = models.ForeignKey(
        Client, on_delete=models.SET_NULL, null=True, blank=True, related_name='source_leads'
    )

    class Meta:
        app_label = 'crm'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class Deal(ChatterMixin, TenantAwareModel):
    """
    A qualified sales opportunity in the CRM pipeline.
    Odoo crm.lead (type=opportunity) equivalent.

    KEY FIX: `stage` is now a FK to CrmStage (configurable from Settings)
    instead of a hardcoded CharField. This lets users add/reorder pipeline
    stages without any code changes â€” exactly like Odoo.
    """
    PRIORITY_CHOICES = [
        ('0', 'Normal'),
        ('1', 'Low'),
        ('2', 'High'),
        ('3', 'Very High'),
    ]

    title = models.CharField(max_length=255)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='deals')
    lead = models.OneToOneField(
        Lead, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='converted_deal', help_text="The lead this deal was converted from"
    )

    # Configurable stage (FK, not hardcoded choices)
    stage = models.ForeignKey(
        CrmStage, on_delete=models.SET_NULL, null=True, blank=True, related_name='deals'
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    probability = models.IntegerField(default=10, help_text="Win probability 0â€“100%")
    priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='0')
    expected_close_date = models.DateField(null=True, blank=True)

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_deals'
    )
    team = models.ForeignKey(
        CrmSalesTeam, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='deals'
    )
    lost_reason = models.ForeignKey(
        LostReason, on_delete=models.SET_NULL, null=True, blank=True
    )
    tags = models.ManyToManyField(CrmTag, blank=True, related_name='deals')
    notes = models.TextField(blank=True)

    class Meta:
        app_label = 'crm'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def is_won(self):
        return self.stage.is_won if self.stage else False

    @property
    def is_lost(self):
        return self.stage.is_lost if self.stage else False


class Activity(TenantAwareModel):
    """
    Legacy CRM activity model. Kept for backward compatibility.
    New code should use core.RecordActivity via ChatterMixin instead.
    """
    TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
    ]
    activity_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    description = models.TextField()
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, null=True, blank=True, related_name='crm_activities')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True, related_name='crm_activities')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True, related_name='crm_activities')

    class Meta:
        app_label = 'crm'
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"{self.activity_type} - {self.created_at.date()}"
