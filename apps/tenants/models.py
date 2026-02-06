from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class Bundle(models.Model):
    name = models.CharField(max_length=100)
    products = models.JSONField(default=list, help_text=_("List of product codes enabled separate by comma or array e.g. ['crm', 'erp']"))
    features = models.JSONField(default=dict, help_text=_("Dictionary of feature flags e.g. {'crm.pipeline': True}"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Tenant(models.Model):
    MODE_CHOICES = [
        ("internal", "Internal"),
        ("standalone", "Standalone"),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text=_("Subdomain or unique identifier"))
    bundle = models.ForeignKey(Bundle, on_delete=models.PROTECT, related_name='tenants')
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default="standalone")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('trialing', 'Trialing'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('incomplete', 'Incomplete')
    ]

    tenant = models.OneToOneField('Tenant', on_delete=models.CASCADE, related_name='subscription')
    bundle = models.ForeignKey('Bundle', on_delete=models.PROTECT, related_name='subscriptions')
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='incomplete')
    current_period_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.bundle.name} ({self.status})"

class Workspace(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='workspaces', null=True, blank=True)
    name = models.CharField(max_length=200)
    # Link to Business Entity (CRM)
    client = models.ForeignKey('crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='workspaces')
    users = models.ManyToManyField('accounts.User', related_name='workspaces', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class SystemMonitor(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='monitors', null=True, blank=True)
    system_name = models.CharField(max_length=200)
    status = models.CharField(max_length=50, default='ok')
    last_checked = models.DateTimeField(auto_now_add=True)
    
    # Add health score
    health_score = models.IntegerField(default=100)

    def __str__(self):
        return f"{self.system_name} ({self.health_score}%)"

class CloudIntegration(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='integrations', null=True, blank=True)
    STATUS_CHOICES = [
        ('connected', 'Connected'),
        ('disconnected', 'Disconnected'),
        ('error', 'Error'),
    ]
    name = models.CharField(max_length=100) # e.g., Microsoft 365
    provider = models.CharField(max_length=100, default='microsoft')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='disconnected')
    last_sync = models.DateTimeField(auto_now=True)
    config = models.JSONField(default=dict, blank=True) # Stub for API keys/settings

    def __str__(self):
        return self.name

class HealthMetric(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='health_metrics', null=True, blank=True)
    name = models.CharField(max_length=100) # e.g., Workspace Health Score, Tickets Management
    score = models.IntegerField(default=0) # 0-100
    updated_at = models.DateTimeField(auto_now=True)
    trend = models.CharField(max_length=10, default='stable') # up, down, stable

    def __str__(self):
        return f"{self.name}: {self.score}"

class RemoteSession(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('connected', 'Connected'),
        ('closed', 'Closed'),
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='remote_sessions', null=True, blank=True)
    session_code = models.CharField(max_length=6, unique=True, help_text="6-digit unique code")
    technician = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='remote_sessions')
    client_ip = models.GenericIPAddressField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    connected_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Session {self.session_code} ({self.status})"
