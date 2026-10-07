from apps.base.domain.models import InstalledModule, CommandCenterSection
from rest_framework import serializers
from apps.base.domain.models import Language, Translation,  Attachment


class AttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ['id', 'name', 'mimetype', 'file_size', 'file_url', 'created_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


from ..domain.models import UoM, UoMCategory, Sequence


class UoMCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UoMCategory
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']


class UoMSerializer(serializers.ModelSerializer):
    class Meta:
        model = UoM
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']


class SequenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sequence
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']


# ─────────────────────────────────────────────────────────────────────────────
# CHATTER SERIALIZERS  (Odoo mail.thread equivalent)
# ─────────────────────────────────────────────────────────────────────────────

from ..domain.models import (
    RecordMessage, RecordActivity, RecordFollower,
    FieldHistory, ScheduledAction,
)
from apps.automation.domain.models import AutomatedAction


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


class FieldHistorySerializer(serializers.ModelSerializer):
    changed_by_info = serializers.SerializerMethodField()

    class Meta:
        model = FieldHistory
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


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = '__all__'

class InstalledModuleSerializer(serializers.ModelSerializer):
    has_update = serializers.SerializerMethodField()

    class Meta:
        model = InstalledModule
        fields = '__all__'
        read_only_fields = ('tenant', 'technical_name')

    def get_has_update(self, obj):
        import os
        import ast
        from django.conf import settings
        manifest_path = os.path.join(settings.BASE_DIR, 'apps', obj.technical_name, '__manifest__.py')
        if os.path.exists(manifest_path):
            try:
                with open(manifest_path, 'r', encoding='utf-8') as f:
                    manifest_content = f.read()
                    manifest_dict = ast.literal_eval(manifest_content)
                    manifest_version = manifest_dict.get('version', '')
                    return bool(manifest_version and manifest_version != obj.version)
            except Exception:
                pass
        return False



class CommandCenterSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandCenterSection
        fields = ['id', 'name', 'sequence']



class SystemEventSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        from apps.base.domain.models import SystemEventLog
        model = SystemEventLog
        fields = ['id', 'user', 'user_email', 'user_name', 'action', 'resource_type', 'resource_id', 'details', 'ip_address', 'created_at']
        read_only_fields = fields

from apps.base.domain.models import SystemParameter

class SystemParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemParameter
        fields = ['id', 'key', 'value', 'description', 'is_system']
        read_only_fields = ['is_system']

from django.contrib.contenttypes.models import ContentType
class ContentTypeSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentType
        fields = ['id', 'app_label', 'model', 'label']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        
    def get_label(self, obj):
        return obj.model.replace('_', ' ').title()



from apps.base.domain.models import DatabaseBackup

class DatabaseBackupSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatabaseBackup
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

from ..domain.models import Country, State

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code']

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'code', 'country']

from ..domain.models import Company
from django.db.models import Q

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'tenant']

    def to_internal_value(self, data):
        # Handle empty strings from frontend FormData (convert to null for UUIDs)
        _data = data.copy() if hasattr(data, 'copy') else data
        for field in ['country', 'state', 'default_currency']:
            if _data.get(field) == '':
                _data[field] = None
        return super().to_internal_value(_data)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        tenant = getattr(request, 'tenant', None) if request else None
        if tenant:
            secure_filter = Q(tenant=tenant) | Q(tenant__isnull=True)
            if 'country' in self.fields:
                self.fields['country'].queryset = Country.all_objects.filter(secure_filter, is_deleted=False)
            if 'state' in self.fields:
                from apps.base.domain.models import State
                self.fields['state'].queryset = State.all_objects.filter(secure_filter, is_deleted=False)
            if 'default_currency' in self.fields:
                from apps.base.domain.models import Currency
                self.fields['default_currency'].queryset = Currency.all_objects.filter(secure_filter, is_deleted=False)


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        from apps.base.domain.models import Currency
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'is_base']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

