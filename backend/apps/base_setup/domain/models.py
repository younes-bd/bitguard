from django.db import models
from apps.core.domain.models import BaseModel, TenantAwareModel

class SystemSetting(TenantAwareModel):
    SETTING_TYPES = (
        ('string', 'String'),
        ('boolean', 'Boolean'),
        ('integer', 'Integer'),
        ('json', 'JSON'),
    )

    key = models.CharField(max_length=255, help_text="Unique identifier for the setting")
    value = models.TextField(blank=True, help_text="Value of the setting")
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES, default='string')
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False, help_text="Can be exposed to unauthenticated users")

    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"
        ordering = ['key']
        unique_together = ('tenant', 'key')

    def __str__(self):
        return f"{self.key}: {self.value}"

class AuditTrail(TenantAwareModel):
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=255, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        verbose_name = "Audit Trail"
        verbose_name_plural = "Audit Trails"
        ordering = ['-created_at']
        indexes = [models.Index(fields=['action', 'tenant'])]

    def __str__(self):
        return f"{self.action} on {self.resource_type} at {self.created_at}"

class PlatformAPIKey(TenantAwareModel):
    name = models.CharField(max_length=255)
    key_prefix = models.CharField(max_length=10, help_text="First few characters of the key for display")
    hashed_key = models.CharField(max_length=128, help_text="Hashed version of the secret key")
    is_active = models.BooleanField(default=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_platform_api_keys')

    class Meta:
        verbose_name = "Platform API Key"
        verbose_name_plural = "Platform API Keys"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.key_prefix}***)"

class WebhookEndpoint(TenantAwareModel):
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=1024)
    secret = models.CharField(max_length=255, blank=True, help_text="Secret for signing payload")
    is_active = models.BooleanField(default=True)
    events = models.JSONField(default=list, help_text="List of events to trigger this webhook")
    
    class Meta:
        verbose_name = "Webhook Endpoint"
        verbose_name_plural = "Webhook Endpoints"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class DatabaseBackup(TenantAwareModel):
    filename = models.CharField(max_length=255)
    size_bytes = models.BigIntegerField()
    status = models.CharField(max_length=50, default='completed')
    triggered_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = "Database Backup"
        verbose_name_plural = "Database Backups"
        ordering = ['-created_at']

    def __str__(self):
        return self.filename

class ErpModule(TenantAwareModel):
    """
    Registry of installed ERP modules for a tenant.
    Mimics Odoo's ir.module.module.
    """
    technical_name = models.CharField(max_length=100, help_text="e.g. 'crm', 'accounting'")
    name = models.CharField(max_length=100, help_text="Human readable name")
    author = models.CharField(max_length=100, blank=True)
    version = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=100, blank=True)
    summary = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=255, blank=True, help_text="Lucide icon name or URL")
    is_installed = models.BooleanField(default=False)
    depends = models.JSONField(default=list, blank=True, help_text="List of technical names this module depends on")
    installable = models.BooleanField(default=True)
    application = models.BooleanField(default=False)
    url = models.CharField(max_length=255, blank=True, help_text="URL path to the live app")
    featured = models.BooleanField(default=False, help_text="Highlight as a featured app")
    
    class Meta:
        verbose_name = "ERP Module"
        verbose_name_plural = "ERP Modules"
        ordering = ['name']
        unique_together = ('tenant', 'technical_name')

    def __str__(self):
        return f"{self.name} ({self.technical_name})"

class Language(TenantAwareModel):
    name = models.CharField(max_length=100, help_text="Language name (e.g., English, French)")
    code = models.CharField(max_length=10, help_text="Language code (e.g., en_US, fr_FR)")
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    direction = models.CharField(max_length=3, choices=[('ltr', 'LTR'), ('rtl', 'RTL')], default='ltr')

    class Meta:
        verbose_name = "Language"
        verbose_name_plural = "Languages"
        ordering = ['name']
        unique_together = ('tenant', 'code')

    def __str__(self):
        return f"{self.name} ({self.code})"


class OutgoingMailServer(TenantAwareModel):
    """SMTP server configuration (Odoo: ir.mail_server)"""
    ENCRYPTION_CHOICES = [
        ('none', 'None'),
        ('starttls', 'TLS (STARTTLS)'),
        ('ssl', 'SSL/TLS'),
    ]
    name = models.CharField(max_length=255, help_text="Description / label")
    smtp_host = models.CharField(max_length=255)
    smtp_port = models.PositiveIntegerField(default=587)
    smtp_user = models.CharField(max_length=255, blank=True)
    smtp_password = models.CharField(max_length=255, blank=True)
    smtp_encryption = models.CharField(max_length=20, choices=ENCRYPTION_CHOICES, default='starttls')
    is_active = models.BooleanField(default=True)
    sequence = models.PositiveIntegerField(default=10, help_text="Priority order — lower = higher priority")

    class Meta:
        verbose_name = "Outgoing Mail Server"
        verbose_name_plural = "Outgoing Mail Servers"
        ordering = ['sequence', 'name']

    def __str__(self):
        return f"{self.name} ({self.smtp_host}:{self.smtp_port})"


class IncomingMailServer(TenantAwareModel):
    """IMAP / POP3 server configuration (Odoo: fetchmail.server)"""
    SERVER_TYPE_CHOICES = [
        ('imap', 'IMAP'),
        ('pop3', 'POP3'),
    ]
    name = models.CharField(max_length=255, help_text="Account label")
    server_type = models.CharField(max_length=10, choices=SERVER_TYPE_CHOICES, default='imap')
    server = models.CharField(max_length=255)
    port = models.PositiveIntegerField(default=993)
    is_ssl = models.BooleanField(default=True)
    user = models.CharField(max_length=255, blank=True)
    password = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    last_fetch = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Incoming Mail Server"
        verbose_name_plural = "Incoming Mail Servers"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.server_type.upper()} {self.server})"

class EmailTemplate(TenantAwareModel):
    """Odoo equivalent: mail.template"""
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=500)
    body_html = models.TextField(blank=True)
    body_text = models.TextField(blank=True)
    model = models.CharField(max_length=100, blank=True, 
                              help_text="e.g. sale.order — applies to this model")
    reply_to = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    lang = models.CharField(max_length=10, blank=True, help_text="e.g. en_US")
    
    # Dynamic fields (Jinja2-style placeholders)
    use_default_to = models.BooleanField(default=True)
    partner_to = models.CharField(max_length=255, blank=True)
    
    class Meta:
        verbose_name = "Email Template"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.model})"
