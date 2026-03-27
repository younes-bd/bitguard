from django.db import models
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel, TenantAwareModel
from django.conf import settings

class Client(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    # Charter §15: Every customer exists in a single lifecycle model
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
    client_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='business')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='prospect')
    industry = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_clients')

    class Meta:
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.name

class Contact(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=100, blank=True, help_text="e.g. Customer, Decision Maker")
    is_primary = models.BooleanField(default=False, help_text="Primary contact for the client")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Lead(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('lost', 'Lost'),
        ('converted', 'Converted'),
    ]
    title = models.CharField(max_length=255)
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='new')
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_leads')

    def __str__(self):
        return self.title

class Deal(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    STAGE_CHOICES = [
        ('prospecting', 'Prospecting'),
        ('proposal', 'Proposal Created'),
        ('negotiation', 'Negotiation'),
        ('won', 'Closed Won'),
        ('lost', 'Closed Lost'),
    ]
    title = models.CharField(max_length=255)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='deals')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='prospecting')
    expected_close_date = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_deals')

    def __str__(self):
        return self.title

class Activity(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
    ]
    activity_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    description = models.TextField()
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, null=True, blank=True, related_name='activities')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True, related_name='activities')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True, related_name='activities')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"{self.activity_type} - {self.created_at.date()}"
