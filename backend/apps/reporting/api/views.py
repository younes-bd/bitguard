from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.apps import apps
from django.template import Template, Context

from apps.reporting.domain.models import ReportTemplate, GeneratedReport, ReportEngineSettings
from .serializers import ReportTemplateSerializer, GeneratedReportSerializer, ReportEngineSettingsSerializer
from apps.reporting.services.pdf_generator import ReportingService

class ReportTemplateViewSet(viewsets.ModelViewSet):
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
            django_template = Template(template_obj.html_content)
            django_context = Context({'record': sample_data})
            rendered_html = django_template.render(django_context)
            
            # Wrap with CSS
            final_html = f"<html><head><style>{template_obj.css_content}</style></head><body>{rendered_html}</body></html>"
            
            return Response({'html': final_html})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GeneratedReportViewSet(viewsets.ModelViewSet):
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
            if template_id:
                template_obj = ReportTemplate.objects.get(id=template_id)
            else:
                template_obj = ReportTemplate.objects.filter(model=record_model_str, is_default=True).first()
                if not template_obj:
                    return Response({'error': f'No default template found for {record_model_str}'}, status=status.HTTP_404_NOT_FOUND)

            # Resolve model, e.g. "erp.Invoice"
            app_label, model_name = record_model_str.split('.')
            model_class = apps.get_model(app_label, model_name)
            record = model_class.objects.get(id=record_id)
            
            # Generate PDF via ReportingService
            attachment = ReportingService.generate_pdf(template_obj, record)
            
            if not attachment:
                return Response({'error': 'PDF generation failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            # Create GeneratedReport
            report = GeneratedReport.objects.create(
                template=template_obj,
                record_model=record_model_str,
                record_id=str(record.id),
                file=attachment.file,
                status='done',
                created_by=request.user
            )

            # Auto-save to EDMS Vault
            try:
                from apps.edms.domain.models import DocumentWorkspace, Document
                # Find or create a 'Generated Documents' workspace
                workspace_name = 'Generated Documents'
                workspace = DocumentWorkspace.objects.filter(name=workspace_name).first()
                if not workspace:
                    workspace = DocumentWorkspace.objects.create(
                        name=workspace_name, 
                        description='Auto-generated documents from the Reporting Engine'
                    )
                
                Document.objects.create(
                    attachment=attachment,
                    workspace=workspace,
                    owner=request.user,
                    source_module=record_model_str,
                    source_id=str(record.id),
                    version='1.0'
                )
            except Exception as edms_e:
                print(f"Failed to auto-save to EDMS: {edms_e}")
            
            serializer = self.get_serializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ReportEngineSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = ReportEngineSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(ReportEngineSettings.objects.all(), self.request)
