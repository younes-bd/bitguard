from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel

class Campaign(BaseModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TYPE_CHOICES = [
        ('email', 'Email Campaign'),
        ('social', 'Social Media Campaign'),
        ('sms', 'SMS Campaign'),
        ('whatsapp', 'WhatsApp Campaign'),
        ('hybrid', 'Hybrid/Omnichannel'),
    ]

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='marketing_campaigns', null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    campaign_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='hybrid')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_campaigns')

    def __str__(self):
        return f"{self.name} ({self.status})"

class CampaignInteraction(BaseModel):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='interactions')
    lead = models.ForeignKey('crm.Lead', on_delete=models.SET_NULL, null=True, blank=True, related_name='marketing_interactions')
    interaction_type = models.CharField(max_length=50, help_text="e.g., Click, Open, Form Submit")
    details = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.interaction_type} on {self.campaign.name}"

class ContentItem(BaseModel):
    TYPE_CHOICES = [
        ('post', 'Social Media Post'),
        ('blog', 'Blog Post'),
        ('email', 'Email Draft'),
        ('caption', 'Social Caption'),
        ('script', 'Video Script')
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('in_review', 'In Review'),
        ('approved', 'Approved'),
        ('scheduled', 'Scheduled'),
        ('published', 'Published'),
        ('archived', 'Archived')
    ]
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='content_items', null=True, blank=True)
    title = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='post')
    body = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='authored_content')
    scheduled_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.title} ({self.content_type})"

class SocialAccount(BaseModel):
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('linkedin', 'LinkedIn'),
        ('x', 'X (Twitter)'),
        ('tiktok', 'TikTok'),
        ('youtube', 'YouTube')
    ]
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='social_accounts', null=True, blank=True)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    account_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    oauth_data = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.account_name} on {self.platform}"

class CreativeAsset(BaseModel):
    ASSET_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('template', 'Template'),
        ('audio', 'Audio')
    ]
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='creative_assets', null=True, blank=True)
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=50, choices=ASSET_TYPES)
    file_url = models.URLField(max_length=500, blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.name

class BrandKit(BaseModel):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='brand_kits', null=True, blank=True)
    name = models.CharField(max_length=255)
    colors = models.JSONField(default=dict, blank=True, help_text="Store hex codes like primary, secondary")
    fonts = models.JSONField(default=dict, blank=True)
    logos = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name

class MarketingWorkflow(BaseModel):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='marketing_workflows', null=True, blank=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    trigger = models.JSONField(default=dict, help_text="Conditions to trigger automation")
    actions = models.JSONField(default=dict, help_text="Actions to perform")
    
    def __str__(self):
        return self.name



# --- MARKETING SUB-DOMAINS (Frontend Visual Matching) ---
class MassMailing(TenantAwareModel):
    subject = models.CharField(max_length=255)
    sent_count = models.IntegerField(default=0)

class SocialPost(TenantAwareModel):
    platform = models.CharField(max_length=50)
    content = models.TextField()

class SMSCampaign(TenantAwareModel):
    message = models.TextField()
    recipients_count = models.IntegerField(default=0)

class Event(TenantAwareModel):
    title = models.CharField(max_length=255)
    date = models.DateTimeField(null=True, blank=True)

class Survey(TenantAwareModel):
    title = models.CharField(max_length=255)
    active = models.BooleanField(default=True)

