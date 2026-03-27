"""Contracts Views — SLA, ServiceContract, Quote management."""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import SLATier, ServiceContract, SLABreach, Quote, QuoteLine
from .serializers import (
    SLATierSerializer, ServiceContractSerializer,
    SLABreachSerializer, QuoteSerializer, QuoteLineSerializer,
)

class SLATierViewSet(viewsets.ReadOnlyModelViewSet):
    """SLA tiers are global — read-only by tenants, managed by admin."""
    permission_classes = [IsAuthenticated]
    serializer_class = SLATierSerializer
    queryset = SLATier.objects.all()

class ServiceContractViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceContractSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(ServiceContract.objects.all(), self.request)

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

class SLABreachViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SLABreachSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(
            SLABreach.objects.select_related('contract'), self.request
        )

class QuoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuoteSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(Quote.objects.prefetch_related('lines'), self.request)

    def perform_create(self, serializer):
        quote = serializer.save(created_by=self.request.user)
        AuditService.log_action(self.request, action="QUOTE_CREATED",
            resource=f"contracts.Quote:{quote.pk}",
            payload={"client": quote.client.name})

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept quote and auto-generate an ERP Invoice."""
        quote = self.get_object()
        if quote.status != 'sent':
            return Response({'error': 'Only sent quotes can be accepted.'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            quote.status = 'accepted'
            quote.save(update_fields=['status'])
            # Auto-generate ERP Invoice
            from apps.erp.models import Invoice
            from django.utils import timezone
            invoice = Invoice.objects.create(
                tenant=quote.tenant,
                client=quote.client,
                invoice_number=f"INV-Q{str(quote.id)[:8].upper()}",
                amount=quote.total,
                issue_date=timezone.now().date(),
                due_date=quote.valid_until or timezone.now().date(),
                status='draft',
            )
            AuditService.log_action(request, action="QUOTE_ACCEPTED_INVOICE_GENERATED",
                resource=f"contracts.Quote:{quote.pk}",
                payload={"invoice_id": str(invoice.pk), "amount": float(quote.total)})
        return Response({'status': 'accepted', 'invoice_id': str(invoice.pk)})

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Mark quote as sent to client."""
        quote = self.get_object()
        quote.status = 'sent'
        quote.save(update_fields=['status'])
        return Response({'status': 'sent'})

class QuoteLineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuoteLineSerializer
    queryset = QuoteLine.objects.all()
