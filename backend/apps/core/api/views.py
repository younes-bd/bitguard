from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from apps.core.domain.models import Partner
from apps.core.services.base import BaseService
from django.db.models import Count
from django.contrib.contenttypes.models import ContentType
import logging

logger = logging.getLogger(__name__)


class PartnerSerializer:
    pass  # handled inline


from rest_framework import serializers

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        from apps.core.domain.models import Partner
        model = Partner
        fields = [
            'id', 'name', 'email', 'phone', 'partner_type',
            'address', 'country', 'website', 'tax_id',
            'credit_limit', 'payment_terms', 'is_active', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PartnerViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for Partners (Vendors, Customers, Suppliers).
    Odoo equivalent of res.partner — tenant-scoped.
    """
    serializer_class = PartnerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = BaseService.filter_by_context(Partner.objects.all(), self.request)
        partner_type = self.request.query_params.get('type')
        if partner_type:
            qs = qs.filter(partner_type=partner_type)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search)
        return qs.order_by('name')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tenant = BaseService.get_tenant_context(request)
        partner = Partner(tenant=tenant, **serializer.validated_data)
        partner.save()
        return Response({'success': True, 'data': self.get_serializer(partner).data}, status=201)

    @action(detail=False, methods=['get'], url_path='vendors')
    def vendors(self, request):
        qs = BaseService.filter_by_context(Partner.objects.filter(partner_type='vendor'), request)
        return Response({'success': True, 'data': self.get_serializer(qs, many=True).data})

    @action(detail=False, methods=['get'], url_path='customers')
    def customers(self, request):
        qs = BaseService.filter_by_context(Partner.objects.filter(partner_type='customer'), request)
        return Response({'success': True, 'data': self.get_serializer(qs, many=True).data})

class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        from apps.core.domain.models import CompanySettings
        model = CompanySettings
        fields = '__all__'

class CompanySettingsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySettingsSerializer
    def get_queryset(self):
        from apps.core.domain.models import CompanySettings
        return CompanySettings.objects.filter(tenant=self.request.user.tenant)

from apps.core.domain.models import UoM, UoMCategory, Sequence, Attachment
from .serializers import UoMSerializer, UoMCategorySerializer, SequenceSerializer, AttachmentSerializer

class UoMViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UoMSerializer
    def get_queryset(self): return UoM.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else UoM.objects.all()

class UoMCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UoMCategorySerializer
    def get_queryset(self): return UoMCategory.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else UoMCategory.objects.all()

class SequenceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SequenceSerializer
    def get_queryset(self): return Sequence.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Sequence.objects.all()

class AttachmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AttachmentSerializer
    def get_queryset(self): return Attachment.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Attachment.objects.all()


# ─────────────────────────────────────────────────────────────────────────────
# CHATTER API VIEWS  (Odoo mail.thread REST equivalent)
# ─────────────────────────────────────────────────────────────────────────────

from apps.core.domain.models import (
    RecordMessage, RecordActivity, RecordFollower,
    FieldChangeLog, AutomatedAction, ScheduledAction,
)
from .serializers import (
    RecordMessageSerializer, RecordActivitySerializer,
    RecordFollowerSerializer, FieldChangeLogSerializer,
    AutomatedActionSerializer, ScheduledActionSerializer,
)


def _get_content_type(model_name: str):
    """
    Resolve a dotted model name like 'crm.Lead' or 'crm.lead' to a ContentType.
    Returns None if not found (graceful fallback).
    """
    try:
        app_label, model = model_name.lower().rsplit('.', 1)
        return ContentType.objects.get(app_label=app_label, model=model)
    except (ContentType.DoesNotExist, ValueError):
        return None


class RecordMessageViewSet(viewsets.ModelViewSet):
    """
    GET  /api/core/messages/?model=crm.Lead&object_id=<uuid>
    POST /api/core/messages/
    DELETE /api/core/messages/<id>/

    The `model` query param accepts dot-notation: 'crm.Lead', 'helpdesk.Ticket', etc.
    """
    serializer_class = RecordMessageSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = RecordMessage.objects.all()
        model_name = self.request.query_params.get('model')
        object_id = self.request.query_params.get('object_id')
        if model_name:
            ct = _get_content_type(model_name)
            if ct:
                qs = qs.filter(content_type=ct)
        if object_id:
            qs = qs.filter(object_id=object_id)
        # Tenant scoping
        if hasattr(self.request.user, 'tenant') and self.request.user.tenant:
            qs = qs.filter(tenant=self.request.user.tenant)
        return qs.select_related('author', 'content_type').order_by('-created_at')

    def perform_create(self, serializer):
        tenant = getattr(self.request.user, 'tenant', None)
        serializer.save(author=self.request.user, tenant=tenant)


class RecordActivityViewSet(viewsets.ModelViewSet):
    """
    GET    /api/core/activities/?model=crm.Deal&object_id=<uuid>
    POST   /api/core/activities/
    PATCH  /api/core/activities/<id>/done/  — mark activity as done
    """
    serializer_class = RecordActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = RecordActivity.objects.all()
        model_name = self.request.query_params.get('model')
        object_id = self.request.query_params.get('object_id')
        show_done = self.request.query_params.get('show_done', 'false').lower() == 'true'

        if model_name:
            ct = _get_content_type(model_name)
            if ct:
                qs = qs.filter(content_type=ct)
        if object_id:
            qs = qs.filter(object_id=object_id)
        if not show_done:
            qs = qs.filter(is_done=False)

        if hasattr(self.request.user, 'tenant') and self.request.user.tenant:
            qs = qs.filter(tenant=self.request.user.tenant)

        return qs.select_related('assigned_to', 'content_type').order_by('due_date')

    def perform_create(self, serializer):
        tenant = getattr(self.request.user, 'tenant', None)
        # Default assigned_to = current user if not provided
        assigned_to = serializer.validated_data.get('assigned_to', self.request.user)
        serializer.save(tenant=tenant, assigned_to=assigned_to)

    @action(detail=True, methods=['patch'], url_path='done')
    def mark_done(self, request, pk=None):
        """PATCH /api/core/activities/<id>/done/ — complete an activity."""
        activity = self.get_object()
        feedback = request.data.get('feedback', '')
        activity.mark_done(feedback=feedback)
        return Response({
            'success': True,
            'data': self.get_serializer(activity).data,
        })

    @action(detail=False, methods=['get'], url_path='my-activities')
    def my_activities(self, request):
        """GET /api/core/activities/my-activities/ — all open activities assigned to me."""
        qs = self.get_queryset().filter(assigned_to=request.user, is_done=False)
        return Response({
            'success': True,
            'count': qs.count(),
            'data': self.get_serializer(qs, many=True).data,
        })


class RecordFollowerViewSet(viewsets.ModelViewSet):
    """
    GET    /api/core/followers/?model=crm.Deal&object_id=<uuid>
    POST   /api/core/followers/            — follow a record
    DELETE /api/core/followers/<id>/       — unfollow
    """
    serializer_class = RecordFollowerSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = RecordFollower.objects.all()
        model_name = self.request.query_params.get('model')
        object_id = self.request.query_params.get('object_id')
        if model_name:
            ct = _get_content_type(model_name)
            if ct:
                qs = qs.filter(content_type=ct)
        if object_id:
            qs = qs.filter(object_id=object_id)
        if hasattr(self.request.user, 'tenant') and self.request.user.tenant:
            qs = qs.filter(tenant=self.request.user.tenant)
        return qs.select_related('user')

    def perform_create(self, serializer):
        tenant = getattr(self.request.user, 'tenant', None)
        # Default follower = current user if not specified
        user = serializer.validated_data.get('user', self.request.user)
        serializer.save(user=user, tenant=tenant)

    @action(detail=False, methods=['delete'], url_path='unfollow')
    def unfollow(self, request):
        """DELETE /api/core/followers/unfollow/ with {model, object_id} payload."""
        model_name = request.data.get('model')
        object_id = request.data.get('object_id')
        if not model_name or not object_id:
            return Response({'error': 'model and object_id are required.'}, status=400)
        ct = _get_content_type(model_name)
        if not ct:
            return Response({'error': f'Model {model_name} not found.'}, status=404)
        deleted, _ = RecordFollower.objects.filter(
            content_type=ct, object_id=object_id, user=request.user
        ).delete()
        return Response({'success': True, 'deleted': deleted})


class FieldChangeLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/core/field-changes/?model=crm.Deal&object_id=<uuid>
    Read-only — changes are written by service layer, not directly by users.
    """
    serializer_class = FieldChangeLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = FieldChangeLog.objects.all()
        model_name = self.request.query_params.get('model')
        object_id = self.request.query_params.get('object_id')
        if model_name:
            ct = _get_content_type(model_name)
            if ct:
                qs = qs.filter(content_type=ct)
        if object_id:
            qs = qs.filter(object_id=object_id)
        if hasattr(self.request.user, 'tenant') and self.request.user.tenant:
            qs = qs.filter(tenant=self.request.user.tenant)
        return qs.select_related('changed_by').order_by('-created_at')


class ChatterSummaryView(APIView):
    """
    GET /api/core/chatter/?model=crm.Deal&object_id=<uuid>

    Returns all chatter data for a record in a single request:
    {
      messages: [...],
      activities: [...],
      followers: [...],
      change_log: [...]
    }

    This mirrors how Odoo loads the full chatter widget in one RPC call.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        model_name = request.query_params.get('model')
        object_id = request.query_params.get('object_id')

        if not model_name or not object_id:
            return Response({'error': 'Both model and object_id query params are required.'}, status=400)

        ct = _get_content_type(model_name)
        if not ct:
            return Response({'error': f'Model "{model_name}" not found.'}, status=404)

        tenant = getattr(request.user, 'tenant', None)
        tenant_filter = {'tenant': tenant} if tenant else {}

        messages = RecordMessage.objects.filter(
            content_type=ct, object_id=object_id, **tenant_filter
        ).select_related('author').order_by('-created_at')[:50]

        activities = RecordActivity.objects.filter(
            content_type=ct, object_id=object_id, is_done=False, **tenant_filter
        ).select_related('assigned_to').order_by('due_date')

        followers = RecordFollower.objects.filter(
            content_type=ct, object_id=object_id, **tenant_filter
        ).select_related('user')

        change_log = FieldChangeLog.objects.filter(
            content_type=ct, object_id=object_id, **tenant_filter
        ).select_related('changed_by').order_by('-created_at')[:30]

        return Response({
            'success': True,
            'model': model_name,
            'object_id': object_id,
            'messages': RecordMessageSerializer(messages, many=True).data,
            'activities': RecordActivitySerializer(activities, many=True).data,
            'followers': RecordFollowerSerializer(followers, many=True).data,
            'change_log': FieldChangeLogSerializer(change_log, many=True).data,
            'is_following': followers.filter(user=request.user).exists(),
        })


class AutomatedActionViewSet(viewsets.ModelViewSet):
    """CRUD for workflow automation rules."""
    serializer_class = AutomatedActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = AutomatedAction.objects.all()
        if hasattr(self.request.user, 'tenant') and self.request.user.tenant:
            qs = qs.filter(tenant=self.request.user.tenant)
        return qs.order_by('name')


class ScheduledActionViewSet(viewsets.ModelViewSet):
    """CRUD for scheduled (cron) background jobs."""
    serializer_class = ScheduledActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = ScheduledAction.objects.all()
        if hasattr(self.request.user, 'tenant') and self.request.user.tenant:
            qs = qs.filter(tenant=self.request.user.tenant)
        return qs.order_by('name')

