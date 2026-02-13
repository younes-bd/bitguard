from django.db import models
from django.utils import timezone
# from django.contrib.postgres.fields import ArrayField  # Removed to avoid dependency

class Asset(models.Model):
    """
    Represents any IT asset (Endpoint, Server, Cloud Resource, IoT Device).
    Aligns with OCSF 'Device' / 'Resource'.
    """
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='assets', null=True, blank=True)
    
    TYPE_CHOICES = [
        ('workstation', 'Workstation'),
        ('server', 'Server'),
        ('cloud_instance', 'Cloud Instance'),
        ('network_device', 'Network Device'),
        ('iot', 'IoT Device'),
        ('mobile', 'Mobile Device'),
    ]
    
    CRITICALITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('mission_critical', 'Mission Critical'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
        ('isolated', 'Isolated'),
        ('compromised', 'Compromised'),
    ]
    
    name = models.CharField(max_length=200, help_text="Hostname or Resource Name")
    asset_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='workstation')
    criticality = models.CharField(max_length=50, choices=CRITICALITY_CHOICES, default='medium')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
    
    # Risk Assessment
    risk_score = models.IntegerField(default=0)
    
    # Technical Details
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    mac_address = models.CharField(max_length=17, null=True, blank=True)
    os_version = models.CharField(max_length=100, blank=True)
    agent_version = models.CharField(max_length=50, blank=True)
    
    # Context
    owner = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='assets')
    location = models.CharField(max_length=100, blank=True, help_text="Physical or Logical Location")
    tags = models.JSONField(default=list, blank=True)
    
    last_seen = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.ip_address})"

class Vulnerability(models.Model):
    """
    Represents a known vulnerability (CVE) present on an Asset.
    """
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='vulnerabilities', null=True, blank=True)
    
    cve_id = models.CharField(max_length=50, help_text="e.g., CVE-2023-1234")
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    severity = models.CharField(max_length=50, choices=[
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ])
    cvss_score = models.FloatField(default=0.0)
    
    affected_assets = models.ManyToManyField(Asset, related_name='vulnerabilities')
    
    status = models.CharField(max_length=50, choices=[
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('patched', 'Patched'),
        ('accepted_risk', 'Accepted Risk'),
    ], default='open')
    
    first_detected = models.DateTimeField(auto_now_add=True)
    last_detected = models.DateTimeField(auto_now=True)
    remediation_plan = models.TextField(blank=True)

    def __str__(self):
        return f"{self.cve_id} - {self.title}"

class Indicator(models.Model):
    """
    Threat Intelligence Indicator (IOC).
    Aligns with STIX Indicator.
    """
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='indicators', null=True, blank=True)
    
    TYPE_CHOICES = [
        ('ipv4', 'IPv4 Address'),
        ('domain', 'Domain Name'),
        ('url', 'URL'),
        ('file_hash', 'File Hash (SHA256/MD5)'),
        ('email', 'Email Address'),
    ]
    
    value = models.CharField(max_length=500)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    source = models.CharField(max_length=100, default='Internal')
    confidence = models.IntegerField(default=50, help_text="0-100 Confidence Score")
    tlp = models.CharField(max_length=20, default='AMBER', choices=[
        ('RED', 'TLP:RED'),
        ('AMBER', 'TLP:AMBER'),
        ('GREEN', 'TLP:GREEN'),
        ('CLEAR', 'TLP:CLEAR'),
    ])
    
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"[{self.type}] {self.value}"

class SecurityAlert(models.Model):
    """
    Represents a security detection or finding.
    Renamed from 'Alert' to 'SecurityAlert' for clarity, but mapped to 'alerts' API.
    """
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='security_alerts', null=True, blank=True)
    
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('informational', 'Informational'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('acknowledged', 'Acknowledged'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('false_positive', 'False Positive'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(max_length=50, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='new')
    
    # Enrichment
    score = models.IntegerField(default=0, help_text="Risk Score (0-100)")
    
    source = models.CharField(max_length=100, default='SIEM')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # MITRE ATT&CK Mapping
    mitre_tactic = models.CharField(max_length=100, blank=True, help_text="e.g., Initial Access")
    mitre_technique = models.CharField(max_length=100, blank=True, help_text="e.g., T1056")
    
    # Relations
    affected_assets = models.ManyToManyField(Asset, related_name='alerts', blank=True)
    related_indicators = models.ManyToManyField(Indicator, related_name='alerts', blank=True)
    
    # Context
    raw_data = models.JSONField(default=dict, blank=True) # Full event log
    
    def __str__(self):
        return f"[{self.severity.upper()}] {self.title}"

class SecurityIncident(models.Model):
    """
    Represents a confirmed security incident requiring response.
    Can be created from one or more Alerts.
    """
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='security_incidents', null=True, blank=True)
    client = models.ForeignKey('crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(max_length=50, default='medium')
    status = models.CharField(max_length=50, default='new') # new, investigating, containment, resolved, closed
    
    assignee = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_incidents')
    
    # SLA & Escalation
    sla_deadline = models.DateTimeField(null=True, blank=True)
    escalation_level = models.IntegerField(default=0)
    is_breached = models.BooleanField(default=False)
    
    alerts = models.ManyToManyField(SecurityAlert, related_name='incidents', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    playbook_logs = models.JSONField(default=list, blank=True)
    resolution_summary = models.TextField(blank=True)
    
    def __str__(self):
        return f"INC-{self.id} {self.title}"

class EmailThreat(models.Model):
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='email_threats', null=True, blank=True)
    sender = models.EmailField()
    recipient = models.EmailField()
    subject = models.CharField(max_length=255)
    threat_type = models.CharField(max_length=100) # Phishing, Malware, Spam
    severity = models.CharField(max_length=50)
    detected_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='blocked')
    
    # Enrichment
    quarantined = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.threat_type} from {self.sender}"

class CloudApp(models.Model):
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='cloud_apps', null=True, blank=True)
    RISK_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    risk_score = models.IntegerField(default=0) # 0-100
    risk_level = models.CharField(max_length=50, choices=RISK_CHOICES, default='low')
    connected_users = models.IntegerField(default=0)
    last_scan = models.DateTimeField(auto_now=True)
    
    # Policy status
    sanctioned = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class NetworkEvent(models.Model):
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='network_events', null=True, blank=True)
    source_ip = models.GenericIPAddressField()
    destination_ip = models.GenericIPAddressField()
    protocol = models.CharField(max_length=20)
    action = models.CharField(max_length=50) # Allowed, Blocked
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.action} {self.protocol} from {self.source_ip}"

class RemediationAction(models.Model):
    incident = models.ForeignKey(SecurityIncident, on_delete=models.CASCADE, related_name='actions')
    action_taken = models.CharField(max_length=255)
    status = models.CharField(max_length=50) # Pending, Completed, Failed
    automated = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.action_taken

class SecurityGap(models.Model):
    workspace = models.ForeignKey('tenants.Workspace', on_delete=models.CASCADE, related_name='security_gaps', null=True, blank=True)
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('ignored', 'Ignored'),
        ('resolved', 'Resolved'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    severity = models.CharField(max_length=50, default='medium')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
