from apps.core.validators import validate_document_file, validate_image_file
import uuid
from django.db import models
from .mixins import ChatterMixin, FieldHistoryMixin
from django.utils import timezone
from django.conf import settings
from apps.core.middleware.http import get_current_tenant
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class UUIDModel(models.Model):
    """
    Standard base model for global BitGuard entities (like Users and Tenants).
    Includes UUID PK, soft-delete, and audit timestamps.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(app_label)s_%(class)s_created')

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

    class Meta:
        abstract = True

class BaseModel(UUIDModel):
    """
    Tenant-aware base model for all isolated BitGuard entities.
    """
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, null=True, blank=True, related_name='%(app_label)s_%(class)s_set')

    def save(self, *args, **kwargs):
        if not getattr(self, 'tenant_id', None):
            current_tenant = get_current_tenant()
            if current_tenant:
                self.tenant = current_tenant
        super().save(*args, **kwargs)

    class Meta:
        abstract = True

class TenantAwareManager(models.Manager):
    def get_queryset(self):
        # Initial filter for soft-delete (if needed) and tenant
        tenant = get_current_tenant()
        qs = super().get_queryset().filter(is_deleted=False)
        if tenant:
            return qs.filter(tenant=tenant)
        return qs

class TenantAwareModel(BaseModel):
    """
    Specialized model that automatically filters queries by the current tenant context.
    """
    objects = TenantAwareManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

# Core app now serves as a utility belt and middleware container.
# All business logic models have been moved to domain-specific apps:
# - Identity -> apps.users
# - Identity Access (RBAC) -> apps.auth
# - Tenancy -> apps.tenants
# - Notifications -> apps.inbox

class SystemEventLog(TenantAwareModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='system_events')
    action = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=255)
    resource_id = models.CharField(max_length=255)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        app_label = 'core'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.action} on {self.resource_type} ({self.resource_id})"

# See apps.audit.models.SystemEventLog for the centralized implementation.

class Partner(TenantAwareModel):
    PARTNER_TYPES = [
        ('customer', 'Customer'),
        ('supplier', 'Supplier'),
        ('both', 'Customer & Supplier'),
        ('internal', 'Internal'),
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    address = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    tax_id = models.CharField(max_length=100, blank=True)
    partner_type = models.CharField(max_length=20, choices=PARTNER_TYPES, default='customer')
    payment_terms = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Profile/Demographic fields transferred from UserProfile
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], blank=True, null=True)
    image = models.ImageField(upload_to='partners/%Y/%m/%d/', blank=True, null=True, validators=[validate_image_file])
    city = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=10, default='en-us')

    def __str__(self):
        return f"{self.name} ({self.get_partner_type_display()})"

class Attachment(TenantAwareModel):
    """
    Generic model for attaching files to ANY record in the database.
    (Odoo ir.attachment equivalent)
    """
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='attachments/%Y/%m/', validators=[validate_document_file])
    res_model = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    res_id = models.CharField(max_length=255)  # Stored as string to support UUIDs and Ints
    content_object = GenericForeignKey('res_model', 'res_id')
    mimetype = models.CharField(max_length=100, blank=True)
    file_size = models.IntegerField(default=0)

    def __str__(self):
        return f"Attachment: {self.name} for {self.res_model.model} ({self.res_id})"

class Sequence(TenantAwareModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50)
    prefix = models.CharField(max_length=20)
    padding = models.IntegerField(default=5)
    next_number = models.IntegerField(default=1)

    class Meta:
        db_table = 'base_setup_sequence'
        verbose_name = 'Sequence'
        verbose_name_plural = 'Sequences'
        unique_together = ('tenant', 'code')

    def __str__(self):
        return f"{self.name} ({self.code})"


class UoMCategory(TenantAwareModel):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class UoM(TenantAwareModel):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(UoMCategory, on_delete=models.CASCADE, related_name='uoms')
    factor = models.FloatField(default=1.0, help_text="Ratio to reference UoM in this category")
    is_reference = models.BooleanField(default=False, help_text="Is this the base unit for this category?")

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class Currency(TenantAwareModel):
    code = models.CharField(max_length=3, unique=True, help_text="e.g. USD, EUR, GBP")
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=5)
    is_base = models.BooleanField(default=False, help_text="Is this the base currency for the tenant?")

    class Meta:
        verbose_name_plural = 'Currencies'

    def __str__(self):
        return f"{self.code} - {self.name}"

class Company(TenantAwareModel):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='child_companies')
    
    # Address
    street = models.CharField(max_length=255, blank=True, null=True)
    street2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.ForeignKey('core.State', on_delete=models.SET_NULL, null=True, blank=True)
    zip_code = models.CharField(max_length=50, blank=True, null=True)
    country = models.ForeignKey('core.Country', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Contact
    phone = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    vat = models.CharField(max_length=100, blank=True, null=True)
    
    # Branding / Document Layout
    logo = models.CharField(max_length=255, blank=True, null=True) # Typically ImageField or CharField for URL
    favicon = models.CharField(max_length=255, blank=True, null=True)
    font = models.CharField(max_length=100, blank=True, null=True)
    paper_format = models.CharField(max_length=100, blank=True, null=True)
    header_text = models.TextField(blank=True, null=True)
    footer_text = models.TextField(blank=True, null=True)
    
    # Localization
    language = models.CharField(max_length=50, blank=True, null=True)
    timezone = models.CharField(max_length=100, blank=True, null=True)
    
    # Social
    twitter = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    
    # Accounting / Settings
    fiscal_year_end_month = models.IntegerField(default=12, blank=True, null=True)
    default_currency = models.ForeignKey('core.Currency', on_delete=models.SET_NULL, null=True, blank=True)
    enable_multicurrency = models.BooleanField(default=False)
    setup_completed = models.BooleanField(default=False)
    multi_company = models.BooleanField(default=False)
    inter_company_transactions = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.name


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# CHATTER SYSTEM  (Odoo mail.thread / mail.activity.mixin equivalent)
# Every business record that inherits ChatterMixin gains:
#   â€¢ Threaded message history (public + internal notes)
#   â€¢ Scheduled activities (calls, emails, meetings, to-dos)
#   â€¢ Follower subscriptions
#   â€¢ Automatic field-change audit trail
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class RecordMessage(TenantAwareModel):
    """
    Generic threaded message attached to ANY model record.
    Odoo mail.message equivalent.

    Usage:
        RecordMessage.objects.create(
            content_type=ContentType.objects.get_for_model(deal),
            object_id=str(deal.pk),
            author=request.user,
            body="Followed up with client today.",
            message_type='note',
            is_internal=True,
            tenant=deal.tenant,
        )
    """
    MESSAGE_TYPE_CHOICES = [
        ('comment', 'Message'),            # public â€” sent to followers by email
        ('note', 'Internal Note'),         # internal only
        ('email', 'Inbound Email'),        # received email matched to record
        ('notification', 'Notification'), # system-generated
    ]

    # Generic FK â€” attaches to ANY model
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE,
        related_name='record_messages',
        verbose_name=_('Record Type'),
    )
    object_id = models.CharField(max_length=255, verbose_name=_('Record ID'))
    content_object = GenericForeignKey('content_type', 'object_id')

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='authored_messages',
        verbose_name=_('Author'),
    )
    message_type = models.CharField(
        max_length=20, choices=MESSAGE_TYPE_CHOICES, default='note',
        verbose_name=_('Message Type'),
    )
    subject = models.CharField(max_length=255, blank=True, verbose_name=_('Subject'))
    body = models.TextField(blank=True, verbose_name=_('Body'))
    is_internal = models.BooleanField(
        default=False,
        verbose_name=_('Internal Note'),
        help_text=_('Internal notes are only visible to team members, not sent externally.'),
    )
    # Attachments stored via core.Attachment generic FK â€” no direct M2M to keep it simple
    attachment_ids = models.JSONField(
        default=list, blank=True,
        help_text=_('List of Attachment UUIDs linked to this message.'),
    )

    class Meta:
        app_label = 'core'
        ordering = ['-created_at']
        verbose_name = _('Record Message')
        verbose_name_plural = _('Record Messages')

    def __str__(self):
        return f"[{self.message_type}] {self.author} â†’ {self.content_type.model}/{self.object_id}"


class RecordActivity(TenantAwareModel):
    """
    Scheduled activity on ANY model record.
    Odoo mail.activity equivalent.

    Activities represent real-world tasks: call a client, send a follow-up email,
    schedule a meeting. They appear in the record's chatter and in the user's
    global activity view.
    """
    ACTIVITY_TYPE_CHOICES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('todo', 'To-Do'),
        ('upload', 'Upload Document'),
        ('custom', 'Custom'),
    ]

    # Generic FK
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE,
        related_name='record_activities',
        verbose_name=_('Record Type'),
    )
    object_id = models.CharField(max_length=255, verbose_name=_('Record ID'))
    content_object = GenericForeignKey('content_type', 'object_id')

    activity_type = models.CharField(
        max_length=30, choices=ACTIVITY_TYPE_CHOICES, default='todo',
        verbose_name=_('Activity Type'),
    )
    summary = models.CharField(
        max_length=255, blank=True, verbose_name=_('Summary'),
        help_text=_('Short description shown on the kanban card.'),
    )
    note = models.TextField(blank=True, verbose_name=_('Notes'))
    due_date = models.DateField(verbose_name=_('Due Date'))
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='assigned_activities',
        verbose_name=_('Assigned To'),
    )
    is_done = models.BooleanField(default=False, verbose_name=_('Done'))
    done_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Completed At'))
    feedback = models.TextField(blank=True, verbose_name=_('Completion Note'))

    class Meta:
        app_label = 'core'
        ordering = ['due_date']
        verbose_name = _('Record Activity')
        verbose_name_plural = _('Record Activities')

    def __str__(self):
        return f"[{self.activity_type}] {self.assigned_to} Â· due {self.due_date}"

    def mark_done(self, feedback=''):
        """Mark this activity as done and log a completion message."""
        from django.utils import timezone
        self.is_done = True
        self.done_at = timezone.now()
        self.feedback = feedback
        self.save(update_fields=['is_done', 'done_at', 'feedback', 'updated_at'])


class RecordFollower(TenantAwareModel):
    """
    Follower subscription: a user subscribed to notifications on a record.
    Odoo mail.followers equivalent.

    When a message is posted on a record, all followers receive an email/notification.
    The record creator and assigned user are auto-subscribed.
    """
    # Generic FK
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE,
        related_name='record_followers',
        verbose_name=_('Record Type'),
    )
    object_id = models.CharField(max_length=255, verbose_name=_('Record ID'))
    content_object = GenericForeignKey('content_type', 'object_id')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='followed_records',
        verbose_name=_('Follower'),
    )
    notify_on_message = models.BooleanField(default=True)
    notify_on_activity = models.BooleanField(default=True)
    notify_on_stage_change = models.BooleanField(default=True)

    class Meta:
        app_label = 'core'
        unique_together = ('content_type', 'object_id', 'user')
        verbose_name = _('Record Follower')
        verbose_name_plural = _('Record Followers')

    def __str__(self):
        return f"{self.user} follows {self.content_type.model}/{self.object_id}"


class FieldHistory(TenantAwareModel):
    """
    Automatic audit log of field value changes on any record.
    Odoo's tracking=True field equivalent.

    Written by ChatterMixin.log_field_change() when a tracked field is updated.
    Displayed in the chatter history as "Field changed: Old â†’ New".
    """
    # Generic FK
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE,
        related_name='field_histories',
        verbose_name=_('Record Type'),
    )
    object_id = models.CharField(max_length=255, verbose_name=_('Record ID'))
    content_object = GenericForeignKey('content_type', 'object_id')

    field_name = models.CharField(max_length=100, verbose_name=_('Field'))
    field_label = models.CharField(max_length=100, blank=True, verbose_name=_('Field Label'))
    old_value = models.TextField(blank=True, verbose_name=_('Previous Value'))
    new_value = models.TextField(blank=True, verbose_name=_('New Value'))
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='field_changes_made',
        verbose_name=_('Changed By'),
    )

    class Meta:
        app_label = 'core'
        ordering = ['-created_at']
        verbose_name = _('Field Change Log')
        verbose_name_plural = _('Field Change Logs')

    def __str__(self):
        return f"{self.content_type.model}/{self.object_id}: {self.field_name} changed by {self.changed_by}"




class ScheduledAction(TenantAwareModel):
    """
    Time-based recurring background job.
    Odoo ir.cron equivalent.
    """
    name = models.CharField(max_length=255)
    model_name = models.CharField(max_length=100)
    method_name = models.CharField(max_length=100)
    interval_number = models.IntegerField(default=1)
    interval_type = models.CharField(max_length=20, choices=[
        ('minutes', 'Minutes'), ('hours', 'Hours'),
        ('days', 'Days'), ('weeks', 'Weeks'), ('months', 'Months'),
    ], default='days')
    next_run = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    last_run = models.DateTimeField(null=True, blank=True)
    last_error = models.TextField(blank=True)

    class Meta:
        app_label = 'core'
        verbose_name = _('Scheduled Action')
        unique_together = ('tenant', 'model_name', 'method_name')



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

    def __str__(self):
        return self.name

class Translation(TenantAwareModel):
    name = models.CharField(max_length=255, help_text="The translation key or original term")
    value = models.TextField(help_text="The translated string")
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='translations')
    module = models.CharField(max_length=100, default='core', help_text="The module this translation belongs to")

    class Meta:
        app_label = 'core'
        verbose_name = "Translation"
        verbose_name_plural = "Translations"
        unique_together = ('tenant', 'language', 'name', 'module')

    def __str__(self):
        return f"{self.name} -> {self.language.code}"

class CommandCenterSection(TenantAwareModel):
    """
    Tier-1 ERP equivalent of ir.module.category or ir.ui.menu.
    Manages the master sequence weights for the Command Center pillars.
    """
    name = models.CharField(max_length=100, help_text="e.g. Finance, Sales, HR")
    sequence = models.IntegerField(default=99, help_text="Master ordering weight (lower appears first)")

    class Meta:
        db_table = 'base_setup_commandcentersection'
        verbose_name = "Command Center Section"
        verbose_name_plural = "Command Center Sections"
        ordering = ['sequence', 'name']
        unique_together = ('tenant', 'name')

    def __str__(self):
        return f"{self.name} (Seq: {self.sequence})"

class InstalledModule(TenantAwareModel):
    """
    Registry of installed ERP modules for a tenant.
    Mimics Odoo's ir.module.module.
    """
    technical_name = models.CharField(max_length=100, help_text="e.g. 'crm', 'accounting'")
    name = models.CharField(max_length=100, help_text="Human readable name")
    display_name = models.CharField(max_length=100, blank=True, help_text="Name shown in Command Center tile")
    author = models.CharField(max_length=100, blank=True)
    version = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=100, blank=True)
    command_center_section = models.CharField(max_length=100, blank=True, help_text="Pillar grouping in Command Center (e.g. Finance, Sales, HR)")
    sequence = models.IntegerField(default=99, help_text="Order within the section")
    summary = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=255, blank=True, help_text="Lucide icon name or URL")
    is_installed = models.BooleanField(default=False)
    depends = models.JSONField(default=list, blank=True, help_text="List of technical names this module depends on")
    installable = models.BooleanField(default=True)
    application = models.BooleanField(default=False)
    url = models.CharField(max_length=255, blank=True, help_text="URL path to the live app")
    website = models.URLField(max_length=255, blank=True, help_text="App creator website")
    license = models.CharField(max_length=100, blank=True, default="LGPL-3")
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0, help_text='App rating out of 5.0')
    featured = models.BooleanField(default=False, help_text="Highlight as a featured app")
    screenshots = models.JSONField(default=list, blank=True, help_text="List of screenshot URLs")
    
    class Meta:
        db_table = 'base_setup_installedmodule'
        verbose_name = "ERP Module"
        verbose_name_plural = "ERP Modules"
        ordering = ['name']
        unique_together = ('tenant', 'technical_name')

    def __str__(self):
        return f"{self.name} ({self.technical_name})"




class SystemParameter(TenantAwareModel):
    key = models.CharField(max_length=255, help_text="e.g. web.base.url, auth.session.timeout")
    value = models.TextField(help_text="Value of the parameter")
    description = models.TextField(blank=True, help_text="What this parameter does")
    is_system = models.BooleanField(default=False, help_text="If True, cannot be deleted (required by system)")
    
    class Meta:
        verbose_name = "System Parameter"
        verbose_name_plural = "System Parameters"
        ordering = ['key']
        unique_together = ('tenant', 'key')
        
    def __str__(self):
        return f"{self.key}: {self.value}"

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

class Country(TenantAwareModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=2, help_text='ISO 3166-1 alpha-2 code', blank=True, null=True)
    phone_code = models.CharField(max_length=50, blank=True, default="")

    class Meta:
        verbose_name_plural = 'Countries'
        ordering = ['name']

    def __str__(self):
        return self.name

class State(TenantAwareModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='states')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, help_text='State code', blank=True, null=True)

    class Meta:
        ordering = ['country__name', 'name']

    def __str__(self):
        return f"{self.name} ({self.country.name})"
