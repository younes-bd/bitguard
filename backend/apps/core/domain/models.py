import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings
from apps.core.middleware import get_current_tenant
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
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, null=True, blank=True, related_name='%(class)s_set')

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
# - Notifications -> apps.notifications

# AuditTrail has been moved to apps.audit to align with domain-driven design.
# See apps.audit.models.AuditTrail for the centralized implementation.

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

    def __str__(self):
        return f"{self.name} ({self.get_partner_type_display()})"

class Attachment(TenantAwareModel):
    """
    Generic model for attaching files to ANY record in the database.
    (Odoo ir.attachment equivalent)
    """
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='attachments/%Y/%m/')
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

class CompanySettings(TenantAwareModel):
    company_name = models.CharField(max_length=255)
    fiscal_year_end_month = models.IntegerField(default=12)
    default_currency = models.ForeignKey('accounting.Currency', on_delete=models.SET_NULL, null=True, blank=True)
    enable_multicurrency = models.BooleanField(default=False)
    setup_completed = models.BooleanField(default=False)


# ─────────────────────────────────────────────────────────────────────────────
# CHATTER SYSTEM  (Odoo mail.thread / mail.activity.mixin equivalent)
# Every business record that inherits ChatterMixin gains:
#   • Threaded message history (public + internal notes)
#   • Scheduled activities (calls, emails, meetings, to-dos)
#   • Follower subscriptions
#   • Automatic field-change audit trail
# ─────────────────────────────────────────────────────────────────────────────

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
        ('comment', 'Message'),            # public — sent to followers by email
        ('note', 'Internal Note'),         # internal only
        ('email', 'Inbound Email'),        # received email matched to record
        ('notification', 'Notification'), # system-generated
    ]

    # Generic FK — attaches to ANY model
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
    # Attachments stored via core.Attachment generic FK — no direct M2M to keep it simple
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
        return f"[{self.message_type}] {self.author} → {self.content_type.model}/{self.object_id}"


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
        return f"[{self.activity_type}] {self.assigned_to} · due {self.due_date}"

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


class FieldChangeLog(TenantAwareModel):
    """
    Automatic audit log of field value changes on any record.
    Odoo's tracking=True field equivalent.

    Written by ChatterMixin.log_field_change() when a tracked field is updated.
    Displayed in the chatter history as "Field changed: Old → New".
    """
    # Generic FK
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE,
        related_name='field_change_logs',
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


class AutomatedAction(TenantAwareModel):
    """
    Event-driven workflow automation rule.
    Odoo base_automation equivalent.

    Example: "When a Ticket's priority changes to Critical, send an email to the manager."
    """
    TRIGGER_CHOICES = [
        ('on_create', 'On Record Creation'),
        ('on_write', 'On Record Update'),
        ('on_unlink', 'On Record Deletion'),
        ('on_stage_set', 'When Stage Is Set To'),
        ('on_time', 'Based on Time Condition'),
    ]
    ACTION_TYPE_CHOICES = [
        ('update_field', 'Update a Field'),
        ('send_email', 'Send Email'),
        ('send_notification', 'Send In-App Notification'),
        ('create_activity', 'Schedule Activity'),
        ('call_webhook', 'Call External Webhook'),
    ]
    name = models.CharField(max_length=255)
    model_name = models.CharField(max_length=100, help_text="e.g. crm.Lead, helpdesk.Ticket")
    trigger = models.CharField(max_length=30, choices=TRIGGER_CHOICES)
    filter_domain = models.JSONField(default=dict, blank=True)
    action_type = models.CharField(max_length=30, choices=ACTION_TYPE_CHOICES)
    action_data = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    last_run = models.DateTimeField(null=True, blank=True)

    class Meta:
        app_label = 'core'
        verbose_name = _('Automated Action')


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


class ChatterMixin(models.Model):
    """
    Abstract mixin that any TenantAwareModel can inherit to gain full chatter
    functionality: messages, activities, followers, field-change logging.

    Usage:
        class Deal(ChatterMixin, TenantAwareModel):
            ...

    The mixin provides helper methods that delegate to the generic
    RecordMessage / RecordActivity / RecordFollower models via
    Django's ContentTypes framework.
    """

    class Meta:
        abstract = True

    # ── Messages ─────────────────────────────────────────────────────────────

    def post_message(self, body, author=None, message_type='comment', is_internal=False, subject=''):
        """Post a message or internal note to this record's chatter thread."""
        ct = ContentType.objects.get_for_model(self)
        msg = RecordMessage.objects.create(
            content_type=ct,
            object_id=str(self.pk),
            author=author,
            message_type=message_type,
            subject=subject,
            body=body,
            is_internal=is_internal,
            tenant=getattr(self, 'tenant', None),
        )
        return msg

    def log_note(self, body, author=None):
        """Post an internal note (not sent externally, styled in amber)."""
        return self.post_message(body, author=author, message_type='note', is_internal=True)

    def get_messages(self):
        """Return all messages for this record, newest first."""
        ct = ContentType.objects.get_for_model(self)
        return RecordMessage.objects.filter(content_type=ct, object_id=str(self.pk))

    # ── Activities ────────────────────────────────────────────────────────────

    def schedule_activity(self, activity_type, due_date, assigned_to=None, summary='', note=''):
        """Schedule a new activity (call, email, meeting, to-do) on this record."""
        ct = ContentType.objects.get_for_model(self)
        return RecordActivity.objects.create(
            content_type=ct,
            object_id=str(self.pk),
            activity_type=activity_type,
            due_date=due_date,
            assigned_to=assigned_to,
            summary=summary,
            note=note,
            tenant=getattr(self, 'tenant', None),
        )

    def get_activities(self, include_done=False):
        """Return open (pending) activities for this record."""
        ct = ContentType.objects.get_for_model(self)
        qs = RecordActivity.objects.filter(content_type=ct, object_id=str(self.pk))
        if not include_done:
            qs = qs.filter(is_done=False)
        return qs

    # ── Followers ─────────────────────────────────────────────────────────────

    def follow(self, user):
        """Subscribe a user to notifications on this record."""
        ct = ContentType.objects.get_for_model(self)
        obj, created = RecordFollower.objects.get_or_create(
            content_type=ct,
            object_id=str(self.pk),
            user=user,
            defaults={'tenant': getattr(self, 'tenant', None)},
        )
        return obj

    def unfollow(self, user):
        """Unsubscribe a user from this record."""
        ct = ContentType.objects.get_for_model(self)
        RecordFollower.objects.filter(
            content_type=ct, object_id=str(self.pk), user=user
        ).delete()

    def get_followers(self):
        """Return all follower records for this record."""
        ct = ContentType.objects.get_for_model(self)
        return RecordFollower.objects.filter(content_type=ct, object_id=str(self.pk))

    # ── Field-Change Tracking ─────────────────────────────────────────────────

    def log_field_change(self, field_name, old_value, new_value, user=None, field_label=''):
        """
        Log a field value change to the FieldChangeLog.
        Call this inside your model's save() or a service method when a tracked
        field changes. The change will appear in the chatter as "Field → New Value".
        """
        ct = ContentType.objects.get_for_model(self)
        return FieldChangeLog.objects.create(
            content_type=ct,
            object_id=str(self.pk),
            field_name=field_name,
            field_label=field_label or field_name.replace('_', ' ').title(),
            old_value=str(old_value) if old_value is not None else '',
            new_value=str(new_value) if new_value is not None else '',
            changed_by=user,
            tenant=getattr(self, 'tenant', None),
        )

    def get_change_log(self):
        """Return all field-change log entries for this record, newest first."""
        ct = ContentType.objects.get_for_model(self)
        return FieldChangeLog.objects.filter(content_type=ct, object_id=str(self.pk))
