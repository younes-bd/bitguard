from apps.core.api.mixins import TenantScopedMixin
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from apps.core.services.audit import AuditService

from ..domain.models import SalesOrder, SalesOrderLine, SalesTeam, Pricelist, QuotationTemplate
from .serializers import (SalesOrderSerializer, SalesOrderLineSerializer, 
                          SalesTeamSerializer, PricelistSerializer,
                          QuotationTemplateSerializer)

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class SalesOrderViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = SalesOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'invoice_status', 'team', 'client']
    search_fields = ['order_number', 'client__name', 'status']
    ordering_fields = ['date_order', 'amount_total', 'status']
    pagination_class = StandardPagination

    def get_queryset(self):
        return SalesOrder.objects.filter(
            tenant=getattr(self.request, 'tenant', None)
        ).select_related('partner', 'crm_lead', 'tenant').prefetch_related('lines').select_related('client', 'user').prefetch_related('lines')

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        count = SalesOrder.objects.filter(tenant=tenant).select_related('partner', 'crm_lead', 'tenant').prefetch_related('lines').count()
        order_number = f"SO-{timezone.now().year}-{count+1:04d}"
        serializer.save(tenant=tenant, created_by=self.request.user, order_number=order_number)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        if not request.user.is_staff and not request.user.is_superuser:
            if not request.user.roles.filter(name__in=['SUPER_ADMIN', 'TENANT_ADMIN', 'MANAGER']).exists():
                return Response({'error': 'Forbidden: Requires sales manager role'}, status=403)
        order = self.get_object()
        if order.status not in ['draft', 'sent']:
            return Response({'error': 'Only draft/sent orders can be confirmed.'}, status=400)
        order.status = 'sale'
        order.save()
        AuditService.log_action(request, 'SALE_ORDER_CONFIRMED', f'sales.SalesOrder:{pk}')
        return Response(SalesOrderSerializer(order).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        order.status = 'cancel'
        order.save()
        return Response(SalesOrderSerializer(order).data)

    @action(detail=True, methods=['post'], url_path='invoice-order')
    def invoice_order(self, request, pk=None):
        order = self.get_object()
        if order.status != 'sale':
            return Response({'error': 'Only confirmed orders can be invoiced.'}, status=400)
        from apps.accounting.services.invoicing import InvoiceService
        invoice = InvoiceService.generate_from_sales_order(order, request.user)
        return Response({'invoice_id': invoice.id, 'invoice_number': str(invoice)}, status=201)

    @action(detail=True, methods=['post'], url_path='create-delivery')
    def create_delivery(self, request, pk=None):
        order = self.get_object()
        if order.status != 'sale':
            return Response({'error': 'Only confirmed orders can generate deliveries.'}, status=400)
        from apps.shipping.domain.models import DeliveryNote
        delivery = DeliveryNote.objects.create(
            tenant=order.tenant,
            sale_order=order,
            status='draft',
            created_by=request.user,
        )
        return Response({'delivery_id': delivery.id}, status=201)

class SalesOrderLineViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = SalesOrderLineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SalesOrderLine.objects.filter(tenant=getattr(self.request, 'tenant', None))

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        serializer.save(tenant=tenant)

class SalesTeamViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = SalesTeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return SalesTeam.objects.filter(tenant=getattr(self.request, 'tenant', None))
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

class PricelistViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = PricelistSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Pricelist.objects.filter(tenant=getattr(self.request, 'tenant', None))
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

class QuotationTemplateViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = QuotationTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return QuotationTemplate.objects.filter(tenant=getattr(self.request, 'tenant', None))
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

