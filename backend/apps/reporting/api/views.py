from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.apps import apps
from django.template import Template, Context
import logging

logger = logging.getLogger(__name__)

from apps.reporting.domain.models import ReportTemplate, ReportTag, GeneratedReport, ReportEngineSettings
from .serializers import ReportTemplateSerializer, GeneratedReportSerializer, ReportEngineSettingsSerializer, ReportTagSerializer
from apps.reporting.services.pdf_generator import ReportingService

class ReportTemplateViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ReportTemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(ReportTemplate.objects.all(), self.request)

    @action(detail=True, methods=['post'])
    def preview(self, request, pk=None):
        template_obj = self.get_object()
        sample_data = request.data.get('sample_data', {})
        try:
            final_html = ReportingService.preview_html(template_obj, sample_data)
            return Response({'html': final_html})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GeneratedReportViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = GeneratedReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(GeneratedReport.objects.all(), self.request)
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        template_id = request.data.get('template_id')
        record_model_str = request.data.get('record_model')
        record_id = request.data.get('record_id')
        
        try:
            report = ReportingService.generate_and_fetch_report(
                template_id, record_model_str, record_id, request.user.tenant
            )
            serializer = self.get_serializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ReportEngineSettingsViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ReportEngineSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(ReportEngineSettings.objects.all(), self.request)

class ReportTagViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ReportTag.objects.all()
    serializer_class = ReportTagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        return ReportTag.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))
