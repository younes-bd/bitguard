from apps.base.models import TenantAwareModel
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Notification(TenantAwareModel):
    TYPES = [
        ('system', 'System'),
        ('crm', 'CRM'),
        ('erp', 'ERP'),
        ('soc', 'SOC'),
        ('ecommerce', 'ecommerce'),
        ('billing', 'Billing'),
        ('hrm', 'HRM'),
        ('services', 'Services'),
        ('approvals', 'Approvals'),
        ('projects', 'Projects'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inbox')
    type = models.CharField(max_length=20, choices=TYPES, default='system')
    title = models.CharField(max_length=255)
    message = models.TextField()
    payload = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    
    # Omni-channel delivery status
    delivered_in_app = models.BooleanField(default=True)
    delivered_email = models.BooleanField(default=False)
    delivered_sms = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.title} ({self.user})"

class NotificationPreference(TenantAwareModel):
    """
    Omni-channel routing preferences for users per notification type.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    type = models.CharField(max_length=20, choices=Notification.TYPES)
    
    in_app_enabled = models.BooleanField(default=True)
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'type')

    def __str__(self):
        return f"{self.user} - {self.type} Preferences"

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
    sequence = models.PositiveIntegerField(default=10, help_text="Priority order â€” lower = higher priority")

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
                              help_text="e.g. sale.order â€” applies to this model")
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

class MailAlias(TenantAwareModel):
    alias_name = models.CharField(max_length=100)
    alias_domain = models.CharField(max_length=255)
    alias_model = models.CharField(max_length=255, blank=True, help_text="e.g. helpdesk.ticket")
    alias_user = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL)
    alias_defaults = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.alias_name}@{self.alias_domain}"

