class TenantScopedMixin:
    def get_queryset(self):
        qs = super().get_queryset()
        user = getattr(self.request, 'user', None)
        
        # ERP Standard: Platform Admins/Superusers have global access across all tenants
        if user and getattr(user, 'is_superuser', False):
            return qs
            
        # Regular users are strictly scoped to their tenant
        if hasattr(self.request, 'tenant') and self.request.tenant:
            return qs.filter(tenant=self.request.tenant)
            
        return qs.none()

from rest_framework.decorators import action
from rest_framework.response import Response

class ReportGenerateMixin:
    @action(detail=True, methods=['post'], url_path='generate-report')
    def generate_report(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        record = self.get_object()
        template = ReportTemplate.objects.filter(
            tenant=getattr(request.user, 'tenant', None),
            model=f"{record._meta.app_label}.{record._meta.model_name}",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, record)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        
        request = self.request
        file_url = request.build_absolute_uri(attachment.file.url) if request and attachment.file else None
        
        return Response({'url': file_url, 'filename': attachment.name})
