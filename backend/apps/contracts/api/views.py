"""Contracts Views — SLA, ServiceContract, Quote management."""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from ..domain.models import SLATier, ServiceContract, SLABreach, Quote, QuoteLine
from ..api.serializers import (
    SLATierSerializer, ServiceContractSerializer,
    SLABreachSerializer, QuoteSerializer, QuoteLineSerializer,
)

class SLATierViewSet(viewsets.ModelViewSet):
    """SLA tiers are global — managed by admin, used by contracts."""
    permission_classes = [IsAuthenticated]
    serializer_class = SLATierSerializer
    queryset = SLATier.objects.all()

class ServiceContractViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceContractSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(ServiceContract.objects.all(), self.request)

    @action(detail=True, methods=['post'], url_path='generate-report')
    def generate_report(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        record = self.get_object()
        template = ReportTemplate.objects.filter(
            tenant=request.user.tenant,
            model=f"{record._meta.app_label}.{record._meta.model_name}",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, record)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        return Response({'url': attachment.file.url, 'filename': attachment.name})

    def perform_create(self, serializer):
        contract = serializer.save()
        AuditService.log_action(self.request, action="CONTRACT_CREATED",
            resource=f"contracts.ServiceContract:{contract.pk}",
            payload={"client": contract.client.name, "type": contract.contract_type})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        contract = self.get_object()
        contract.status = 'active'
        contract.save(update_fields=['status'])
        AuditService.log_action(request, action="CONTRACT_ACTIVATED",
            resource=f"contracts.ServiceContract:{contract.pk}",
            payload={"client": contract.client.name})
        return Response({'status': 'active'})

    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        contract = self.get_object()
        contract.status = 'terminated'
        contract.save(update_fields=['status'])
        return Response({'status': contract.status})

    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        contract = self.get_object()
        contract.status = 'active'
        contract.save(update_fields=['status'])
        return Response({'status': contract.status})

    @action(detail=False, methods=['get'])
    def mrr_summary(self, request):
        from django.db.models import Sum
        qs = self.get_queryset().filter(status='active')
        total_mrr = qs.aggregate(mrr=Sum('monthly_value'))['mrr'] or 0
        return Response({'status': 'success', 'data': {'total_mrr': float(total_mrr)}})

class SLABreachViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SLABreachSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(
            SLABreach.objects.select_related('contract'), self.request
        )

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        breach = self.get_object()
        breach.acknowledged = True
        breach.save(update_fields=['acknowledged'])
        return Response({'status': 'acknowledged'})

class QuoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuoteSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(Quote.objects.prefetch_related('lines'), self.request)

    @action(detail=True, methods=['post'], url_path='generate-report')
    def generate_report(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        record = self.get_object()
        template = ReportTemplate.objects.filter(
            tenant=request.user.tenant,
            model=f"{record._meta.app_label}.{record._meta.model_name}",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, record)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        return Response({'url': attachment.file.url, 'filename': attachment.name})

    def perform_create(self, serializer):
        quote = serializer.save(created_by=self.request.user)
        AuditService.log_action(self.request, action="QUOTE_CREATED",
            resource=f"contracts.Quote:{quote.pk}",
            payload={"client": quote.client.name})

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept quote and auto-generate a Billing Invoice."""
        quote = self.get_object()
        if quote.status != 'sent':
            return Response({'error': 'Only sent quotes can be accepted.'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            quote.status = 'accepted'
            quote.save(update_fields=['status'])
            
            # Auto-generate Billing Invoice using InvoiceService
            from apps.accounting.application.services import InvoiceService
            try:
                invoice = InvoiceService.create_from_quote(quote, request)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response({'status': 'accepted', 'invoice_id': str(invoice.pk)})

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Mark quote as sent to client."""
        quote = self.get_object()
        quote.status = 'sent'
        quote.save(update_fields=['status'])
        return Response({'status': 'sent'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        quote = self.get_object()
        quote.status = 'rejected'
        quote.save(update_fields=['status'])
        return Response({'status': quote.status})

    @action(detail=False, methods=['get'])
    def expire_check(self, request):
        from django.utils import timezone
        qs = self.get_queryset().filter(valid_until__lt=timezone.now().date(), status__in=['draft', 'sent'])
        count = qs.update(status='expired')
        return Response({'status': 'success', 'expired_count': count})

class QuoteLineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuoteLineSerializer
    queryset = QuoteLine.objects.all()
