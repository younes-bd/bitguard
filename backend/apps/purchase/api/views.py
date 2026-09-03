from apps.core.api.mixins import TenantScopedMixin
"""Purchase Views"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from ..domain.models import Vendor, PurchaseOrder, PurchaseOrderLine, RFQ, VendorPricelist
from .serializers import (
    VendorSerializer, PurchaseOrderSerializer, PurchaseOrderLineSerializer, RFQSerializer, VendorPricelistSerializer
)

class VendorViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(Vendor.objects.all(), self.request)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs_vendor = BaseService.filter_by_context(Vendor.objects.all(), request)
        qs_po = BaseService.filter_by_context(PurchaseOrder.objects.all(), request)
        return Response({'status': 'success', 'data': {
            'vendors': qs_vendor.filter(status='active').count(),
            'pending_pos': qs_po.filter(status__in=['draft', 'sent']).count(),
        }})

class PurchaseOrderViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseOrderSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(PurchaseOrder.objects.prefetch_related('lines'), self.request)

    def perform_create(self, serializer):
        po = serializer.save(created_by=self.request.user)
        AuditService.log_action(self.request, action="PURCHASE_PO_CREATED",
            resource=f"purchase.PurchaseOrder:{po.pk}",
            payload={"vendor": po.vendor.name})

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

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        po = self.get_object()
        po.status = 'confirmed'
        po.approved_by = request.user
        po.save()
        AuditService.log_action(request.user, 'PURCHASE_PO_APPROVED', f"Purchase Order {po.id} approved", po)
        return Response({'status': po.status})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        po = self.get_object()
        po.status = 'cancelled'
        po.save()
        return Response({'status': po.status})

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        order = self.get_object()
        if order.status not in ['confirmed', 'purchase']:
            return Response({'error': 'Only confirmed purchase orders can be received.'}, status=status.HTTP_400_BAD_REQUEST)
            
        from apps.stock.services.receipts import ReceiptService
        receipt = ReceiptService.generate_for_purchase_order(order, request.user)
        order.status = 'done'
        order.save()
        return Response({'receipt_id': receipt.id, 'status': order.status}, status=status.HTTP_201_CREATED)

class PurchaseOrderLineViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseOrderLineSerializer
    queryset = PurchaseOrderLine.objects.all()

from apps.core.api.mixins import ReportGenerateMixin

class RFQViewSet(ReportGenerateMixin, TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RFQSerializer
    def get_queryset(self): return BaseService.filter_by_context(RFQ.objects.all(), self.request)

    @action(detail=True, methods=['post'])
    def convert_to_po(self, request, pk=None):
        rfq = self.get_object()
        rfq.status = 'done'
        rfq.save()
        return Response({'status': 'converted_to_po'})

class VendorPricelistViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorPricelistSerializer
    def get_queryset(self): return BaseService.filter_by_context(VendorPricelist.objects.all(), self.request)

class PurchaseDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs_vendor = BaseService.filter_by_context(Vendor.objects.all(), request)
        qs_po = BaseService.filter_by_context(PurchaseOrder.objects.all(), request)
        
        return standard_response(True, "Purchase Dashboard Data", {
            'active_vendors': qs_vendor.filter(status='active').count(),
            'total_vendors': qs_vendor.count(),
            'pending_orders': qs_po.filter(status__in=['draft', 'sent', 'issued']).count(),
            'open_pos': qs_po.filter(status__in=['issued', 'approved']).count(),
        })
