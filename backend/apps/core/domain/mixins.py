import json
from django.db import models
from django.contrib.contenttypes.models import ContentType

class ChatterMixin(models.Model):
    """
    Tier-1 ERP Chatter Mixin (inspired by Odoo).
    Provides methods for messages, activities, followers, and field-change tracking.
    Models must inherit from this to gain Chatter capabilities.
    """
    class Meta:
        abstract = True

    # ── Messages ─────────────────────────────────────────────────────────────

    def post_message(self, body, author=None, message_type='comment', subject='', is_internal=False):
        """Post a message (or note) to the record's chatter."""
        ct = ContentType.objects.get_for_model(self)
        from .models import RecordMessage
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
        from .models import RecordMessage
        return RecordMessage.objects.filter(content_type=ct, object_id=str(self.pk))

    # ── Activities ───────────────────────────────────────────────────────────

    def schedule_activity(self, activity_type, due_date, assigned_to=None, summary='', note=''):
        """Schedule a new activity (call, email, meeting, to-do) on this record."""
        ct = ContentType.objects.get_for_model(self)
        from .models import RecordActivity
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
        from .models import RecordActivity
        qs = RecordActivity.objects.filter(content_type=ct, object_id=str(self.pk))
        if not include_done:
            qs = qs.filter(is_done=False)
        return qs

    # ── Followers ────────────────────────────────────────────────────────────

    def follow(self, user):
        """Subscribe a user to notifications on this record."""
        ct = ContentType.objects.get_for_model(self)
        from .models import RecordFollower
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
        from .models import RecordFollower
        RecordFollower.objects.filter(
            content_type=ct, object_id=str(self.pk), user=user
        ).delete()

    def get_followers(self):
        """Return all follower records for this record."""
        ct = ContentType.objects.get_for_model(self)
        from .models import RecordFollower
        return RecordFollower.objects.filter(content_type=ct, object_id=str(self.pk))

    # ── Field-Change Tracking ────────────────────────────────────────────────

    def log_field_change(self, field_name, old_value, new_value, user=None, field_label=''):
        """
        Log a field value change to the FieldHistory.
        Call this inside your model's save() or a service method when a tracked
        field changes. The change will appear in the chatter as "Field → New Value".
        """
        ct = ContentType.objects.get_for_model(self)
        from .models import FieldHistory
        return FieldHistory.objects.create(
            content_type=ct,
            object_id=str(self.pk),
            field_name=field_name,
            field_label=field_label or field_name.replace('_', ' ').title(),
            old_value=str(old_value) if old_value is not None else '',
            new_value=str(new_value) if new_value is not None else '',
            changed_by=user,
            tenant=getattr(self, 'tenant', None),
        )

    def get_field_history(self):
        """Return all field-change log entries for this record, newest first."""
        ct = ContentType.objects.get_for_model(self)
        from .models import FieldHistory
        return FieldHistory.objects.filter(content_type=ct, object_id=str(self.pk))


class FieldHistoryMixin(models.Model):
    """
    Tier-1 ERP standard audit log.
    Automatically tracks old vs new values on save().
    """
    class Meta:
        abstract = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_state = self._dict

    @property
    def _dict(self):
        return {f.name: str(getattr(self, f.name)) for f in self._meta.fields if not f.is_relation and f.name not in ['created_at', 'updated_at']}

    def save(self, *args, **kwargs):
        is_new = not self.pk
        
        # Calculate changes before saving
        action = 'CREATE' if is_new else 'UPDATE'
        changes = {}
        if is_new:
            changes = self._dict
        else:
            new_state = self._dict
            for k in new_state:
                if new_state[k] != self._original_state.get(k):
                    changes[k] = {'old': self._original_state.get(k), 'new': new_state[k]}
        
        super().save(*args, **kwargs)
        
        if changes:
            from apps.core.middleware.http import get_current_request
            from django.contrib.contenttypes.models import ContentType
            from .models import FieldHistory
            
            request = get_current_request()
            user = getattr(request, 'user', None) if request else None
            if user and not user.is_authenticated:
                user = None
                
            ct = ContentType.objects.get_for_model(self)
            
            for field, vals in changes.items():
                if isinstance(vals, dict) and 'old' in vals and 'new' in vals:
                    FieldHistory.objects.create(
                        content_type=ct,
                        object_id=str(self.pk),
                        field_name=field,
                        old_value=str(vals['old']),
                        new_value=str(vals['new']),
                        changed_by=user,
                        tenant=getattr(self, 'tenant', None)
                    )
                else:
                    FieldHistory.objects.create(
                        content_type=ct,
                        object_id=str(self.pk),
                        field_name=field,
                        old_value='',
                        new_value=str(vals),
                        changed_by=user,
                        tenant=getattr(self, 'tenant', None)
                    )
        
        # Reset original state for subsequent saves in the same transaction
        self._original_state = self._dict
