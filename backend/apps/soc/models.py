from django.db import models
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel, TenantAwareModel
from django.conf import settings

class Alert(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical')
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=50, choices=SEVERITY_CHOICES)
    source = models.CharField(max_length=100, help_text="e.g. Firewall, IDS")
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"[{self.get_severity_display()}] {self.title}"

class Incident(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('investigating', 'Investigating'),
        ('mitigated', 'Mitigated'),
        ('closed', 'Closed')
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='open')
    alerts = models.ManyToManyField(Alert, related_name='incidents', blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title

class ThreatIntelligence(UUIDPrimaryKeyModel, TimeStampedModel):
    # Global threat feeds, not tenant isolated
    indicator = models.CharField(max_length=255, help_text="IP, Domain, File Hash")
    indicator_type = models.CharField(max_length=50, help_text="e.g. IP Address, Malicious URL")
    confidence = models.IntegerField(default=50, help_text="0-100 score")
    description = models.TextField()

    class Meta:
        verbose_name_plural = 'Threat Intelligence'

    def __str__(self):
        return self.indicator

class LogAnalysis(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    source_system = models.CharField(max_length=100)
    raw_log = models.TextField()
    parsed_data = models.JSONField(default=dict, blank=True)
    flagged_anomalous = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Log Analyses'

    def __str__(self):
        return f"Log from {self.source_system} at {self.created_at}"


# ─────────────────────────────────────────────
# Security Platform Models (Customer-facing)
# Backs the BitGuard Security SaaS product
# ─────────────────────────────────────────────

class Workspace(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    A logical grouping of a customer's monitored environment.
    e.g. 'HQ Network', 'AWS Production', 'Remote Offices'
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='workspaces'
    )

    class Meta:
        unique_together = ('tenant', 'name')

    def __str__(self):
        return self.name


class ManagedEndpoint(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    A managed device (server, workstation, firewall) monitored by BitGuard.
    Equivalent to an 'asset' in ITAM/MDR terminology.
    """
    STATUS_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('isolated', 'Isolated'),
        ('at_risk', 'At Risk'),
        ('maintenance', 'Maintenance'),
    ]
    TYPE_CHOICES = [
        ('workstation', 'Workstation'),
        ('server', 'Server'),
        ('firewall', 'Firewall'),
        ('router', 'Router'),
        ('switch', 'Switch'),
        ('mobile', 'Mobile Device'),
        ('iot', 'IoT Device'),
        ('other', 'Other'),
    ]
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name='endpoints', null=True, blank=True
    )
    hostname = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    mac_address = models.CharField(max_length=17, blank=True)
    device_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='workstation')
    os = models.CharField(max_length=100, blank=True, help_text="e.g. Windows 11, Ubuntu 22.04")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='online')
    agent_version = models.CharField(max_length=50, blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    risk_score = models.IntegerField(default=0, help_text="0-100 risk score")

    def __str__(self):
        return f"{self.hostname} ({self.ip_address})"

    class Meta:
        verbose_name = 'Managed Endpoint'


class CloudApp(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    A SaaS or cloud application used by the customer (Microsoft 365, Google Workspace, AWS, etc.).
    Monitored for shadow IT, misconfigurations, and anomalies.
    """
    STATUS_CHOICES = [
        ('healthy', 'Healthy'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
        ('unknown', 'Unknown'),
    ]
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name='cloud_apps', null=True, blank=True
    )
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=100, help_text="e.g. Microsoft, Google, AWS")
    app_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unknown')
    users_count = models.IntegerField(default=0)
    risk_level = models.CharField(
        max_length=20,
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')],
        default='low'
    )
    last_reviewed = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.provider})"

    class Meta:
        verbose_name = 'Cloud App'


class SystemMonitor(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Health and performance metrics for a monitored endpoint.
    Tracks CPU, RAM, disk, and uptime telemetry.
    """
    endpoint = models.ForeignKey(
        ManagedEndpoint, on_delete=models.CASCADE, related_name='monitors'
    )
    cpu_usage = models.FloatField(default=0.0, help_text="Percentage 0-100")
    ram_usage = models.FloatField(default=0.0, help_text="Percentage 0-100")
    disk_usage = models.FloatField(default=0.0, help_text="Percentage 0-100")
    uptime_seconds = models.BigIntegerField(default=0)
    is_anomalous = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'System Monitor'
        ordering = ['-created_at']

    def __str__(self):
        return f"Monitor @ {self.endpoint.hostname} [{self.created_at}]"


class NetworkEvent(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    A network-level security or traffic event (port scan, anomalous connection, DDoS attempt).
    """
    CATEGORY_CHOICES = [
        ('intrusion_attempt', 'Intrusion Attempt'),
        ('port_scan', 'Port Scan'),
        ('ddos', 'DDoS Activity'),
        ('lateral_movement', 'Lateral Movement'),
        ('data_exfiltration', 'Data Exfiltration'),
        ('anomalous_traffic', 'Anomalous Traffic'),
        ('normal', 'Normal'),
    ]
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name='network_events', null=True, blank=True
    )
    source_ip = models.GenericIPAddressField(null=True, blank=True)
    destination_ip = models.GenericIPAddressField(null=True, blank=True)
    source_port = models.IntegerField(null=True, blank=True)
    destination_port = models.IntegerField(null=True, blank=True)
    protocol = models.CharField(max_length=20, blank=True, help_text="TCP, UDP, ICMP")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='normal')
    is_blocked = models.BooleanField(default=False)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = 'Network Event'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.category} from {self.source_ip}"


class CloudIntegration(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    A connected third-party integration (e.g. Microsoft 365, AWS, Okta, Slack).
    Used for data ingestion, SIEM feed, and automation triggers.
    """
    STATUS_CHOICES = [
        ('connected', 'Connected'),
        ('disconnected', 'Disconnected'),
        ('error', 'Error'),
    ]
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='disconnected')
    config = models.JSONField(default=dict, blank=True, help_text="Encrypted integration config")
    last_sync = models.DateTimeField(null=True, blank=True)
    workspace = models.ForeignKey(
        Workspace, on_delete=models.SET_NULL, null=True, blank=True, related_name='integrations'
    )

    def __str__(self):
        return f"{self.name} ({self.provider}) — {self.status}"

    class Meta:
        verbose_name = 'Cloud Integration'


class RemoteSession(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    A remote management session opened by a BitGuard technician to a ManagedEndpoint.
    Fully auditable — Charter §11.
    """
    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('active', 'Active'),
        ('ended', 'Ended'),
        ('rejected', 'Rejected'),
    ]
    endpoint = models.ForeignKey(
        ManagedEndpoint, on_delete=models.CASCADE, related_name='sessions'
    )
    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='remote_sessions'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    session_token = models.CharField(max_length=255, blank=True, help_text="Secure one-time token")
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    purpose = models.TextField(blank=True, help_text="Reason for remote access")

    class Meta:
        verbose_name = 'Remote Session'
        ordering = ['-created_at']

    def __str__(self):
        return f"Session to {self.endpoint.hostname} by {self.initiated_by}"
