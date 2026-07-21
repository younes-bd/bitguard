from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from apps.core.services.audit import AuditService

from ..domain.models import SaleOrder, SaleOrderLine, SalesTeam, Pricelist, QuotationTemplate
from .serializers import (SaleOrderSerializer, SaleOrderLineSerializer, 
                          SalesTeamSerializer, PricelistSerializer,
                          QuotationTemplateSerializer)

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class SaleOrderViewSet(viewsets.ModelViewSet):
    serializer_class = SaleOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'invoice_status', 'team', 'client']
    search_fields = ['order_number', 'client__name', 'status']
    ordering_fields = ['date_order', 'amount_total', 'status']
    pagination_class = StandardPagination

    def get_queryset(self):
        return SaleOrder.objects.filter(
            tenant=self.request.user.tenant
        ).select_related('client', 'user').prefetch_related('lines')

    def perform_create(self, serializer):
        tenant = self.request.user.tenant
        count = SaleOrder.objects.filter(tenant=tenant).count()
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
        AuditService.log_action(request, 'SALE_ORDER_CONFIRMED', f'sale.SaleOrder:{pk}')
        return Response(SaleOrderSerializer(order).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        order.status = 'cancel'
        order.save()
        return Response(SaleOrderSerializer(order).data)

    @action(detail=True, methods=['post'], url_path='invoice-order')
    def invoice_order(self, request, pk=None):
        order = self.get_object()
        if order.status != 'sale':
            return Response({'error': 'Only confirmed orders can be invoiced.'}, status=400)
        from apps.accounting.domain.models import Invoice, InvoiceLine
        invoice = Invoice.objects.create(
            tenant=order.tenant,
            client=order.client,
            status='draft',
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + timedelta(days=30),
            created_by=request.user,
            reference=order.order_number,
        )
        for line in order.lines.all():
            InvoiceLine.objects.create(
                invoice=invoice, description=line.name,
                quantity=line.product_uom_qty, unit_price=line.price_unit,
                tax_rate=line.tax_rate, subtotal=line.price_subtotal
            )
        return Response({'invoice_id': invoice.id, 'invoice_number': str(invoice)}, status=201)

    @action(detail=True, methods=['post'], url_path='create-delivery')
    def create_delivery(self, request, pk=None):
        order = self.get_object()
        if order.status != 'sale':
            return Response({'error': 'Only confirmed orders can generate deliveries.'}, status=400)
        from apps.delivery.domain.models import DeliveryNote
        delivery = DeliveryNote.objects.create(
            tenant=order.tenant,
            sale_order=order,
            status='draft',
            created_by=request.user,
        )
        return Response({'delivery_id': delivery.id}, status=201)

class SaleOrderLineViewSet(viewsets.ModelViewSet):
    serializer_class = SaleOrderLineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SaleOrderLine.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        tenant = self.request.user.tenant
        serializer.save(tenant=tenant)

class SalesTeamViewSet(viewsets.ModelViewSet):
    serializer_class = SalesTeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return SalesTeam.objects.filter(tenant=self.request.user.tenant)
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class PricelistViewSet(viewsets.ModelViewSet):
    serializer_class = PricelistSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Pricelist.objects.filter(tenant=self.request.user.tenant)
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class QuotationTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = QuotationTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return QuotationTemplate.objects.filter(tenant=self.request.user.tenant)
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

