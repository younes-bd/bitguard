from rest_framework import serializers
from apps.core.domain.models import Attachment


class AttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ['id', 'name', 'mimetype', 'file_size', 'file_url', 'created_at']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


from ..domain.models import UoM, UoMCategory, Sequence


class UoMCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UoMCategory
        fields = '__all__'


class UoMSerializer(serializers.ModelSerializer):
    class Meta:
        model = UoM
        fields = '__all__'


class SequenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sequence
        fields = '__all__'


# ─────────────────────────────────────────────────────────────────────────────
# CHATTER SERIALIZERS  (Odoo mail.thread equivalent)
# ─────────────────────────────────────────────────────────────────────────────

from ..domain.models import (
    RecordMessage, RecordActivity, RecordFollower,
    FieldChangeLog, AutomatedAction, ScheduledAction,
)


class AuthorNestedSerializer(serializers.Serializer):
    """Lightweight author info embedded in messages/activities."""
    id = serializers.UUIDField()
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField()

    def get_full_name(self, obj):
        return getattr(obj, 'get_full_name', lambda: str(obj))()


class RecordMessageSerializer(serializers.ModelSerializer):
    author_info = serializers.SerializerMethodField()
    content_type_label = serializers.SerializerMethodField()

    class Meta:
        model = RecordMessage
        fields = [
            'id', 'content_type', 'object_id', 'content_type_label',
            'author', 'author_info',
            'message_type', 'subject', 'body', 'is_internal',
            'attachment_ids', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'author_info', 'content_type_label']

    def get_author_info(self, obj):
        if not obj.author:
            return None
        user = obj.author
        return {
            'id': str(user.id),
            'full_name': user.get_full_name() or str(user),
            'email': user.email,
            'initials': ''.join(p[0].upper() for p in (user.get_full_name() or str(user)).split()[:2]),
        }

    def get_content_type_label(self, obj):
        return obj.content_type.model if obj.content_type_id else None


class RecordActivitySerializer(serializers.ModelSerializer):
    assigned_to_info = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = RecordActivity
        fields = [
            'id', 'content_type', 'object_id',
            'activity_type', 'summary', 'note',
            'due_date', 'assigned_to', 'assigned_to_info',
            'is_done', 'done_at', 'feedback',
            'is_overdue', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_overdue', 'assigned_to_info']

    def get_assigned_to_info(self, obj):
        if not obj.assigned_to:
            return None
        user = obj.assigned_to
        return {
            'id': str(user.id),
            'full_name': user.get_full_name() or str(user),
            'email': user.email,
        }

    def get_is_overdue(self, obj):
        from django.utils import timezone
        if obj.is_done:
            return False
        return obj.due_date < timezone.now().date()


class RecordFollowerSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()

    class Meta:
        model = RecordFollower
        fields = [
            'id', 'content_type', 'object_id',
            'user', 'user_info',
            'notify_on_message', 'notify_on_activity', 'notify_on_stage_change',
        ]
        read_only_fields = ['id', 'user_info']

    def get_user_info(self, obj):
        user = obj.user
        return {
            'id': str(user.id),
            'full_name': user.get_full_name() or str(user),
            'email': user.email,
        }


class FieldChangeLogSerializer(serializers.ModelSerializer):
    changed_by_info = serializers.SerializerMethodField()

    class Meta:
        model = FieldChangeLog
        fields = [
            'id', 'content_type', 'object_id',
            'field_name', 'field_label', 'old_value', 'new_value',
            'changed_by', 'changed_by_info', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'changed_by_info']

    def get_changed_by_info(self, obj):
        if not obj.changed_by:
            return None
        user = obj.changed_by
        return {
            'id': str(user.id),
            'full_name': user.get_full_name() or str(user),
        }


class AutomatedActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomatedAction
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_run']


class ScheduledActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledAction
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_run', 'last_error']

