from apps.core.api.mixins import TenantScopedMixin
"""Inventory Views"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from ..domain.models import (
    Warehouse, InventoryItem, GoodsReceipt, GoodsReceiptLine, 
    StockMove, StockAdjustment, ReorderRule,
    StockLot, StorageLocation, StockPicking
)
from .serializers import (
    WarehouseSerializer, InventoryItemSerializer, GoodsReceiptSerializer, GoodsReceiptLineSerializer,
    StockMoveSerializer, StockAdjustmentSerializer, ReorderRuleSerializer,
    StockLotSerializer, StorageLocationSerializer, StockPickingSerializer
)

class StockLotViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StockLotSerializer
    def get_queryset(self):
        return BaseService.filter_by_context(StockLot.objects.all(), self.request)

class StorageLocationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StorageLocationSerializer
    def get_queryset(self):
        return BaseService.filter_by_context(StorageLocation.objects.all(), self.request)

class StockPickingViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StockPickingSerializer
    def get_queryset(self):
        return BaseService.filter_by_context(StockPicking.objects.all(), self.request)

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

class WarehouseViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WarehouseSerializer
    def get_queryset(self):
        return BaseService.filter_by_context(Warehouse.objects.all(), self.request)

class InventoryItemViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InventoryItemSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(InventoryItem.objects.all(), self.request)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        items = [i for i in self.get_queryset() if i.is_low_stock]
        return Response(InventoryItemSerializer(items, many=True).data)

    @action(detail=True, methods=['post'])
    def adjust(self, request, pk=None):
        item = self.get_object()
        quantity = request.data.get('quantity')
        if quantity is None:
            return Response({'error': 'quantity is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
        except ValueError:
            return Response({'error': 'quantity must be an integer'}, status=status.HTTP_400_BAD_REQUEST)
        
        item.quantity_on_hand += quantity
        item.save(update_fields=['quantity_on_hand'])

        AuditService.log_action(
            request, 
            action="INVENTORY_STOCK_ADJUST",
            resource=f"inventory.InventoryItem:{item.pk}",
            payload={"quantity_adjusted": quantity, "new_quantity": item.quantity_on_hand}
        )

        return Response({'status': 'success', 'data': InventoryItemSerializer(item).data})

from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class GoodsReceiptViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GoodsReceiptSerializer
    def get_queryset(self): return BaseService.filter_by_context(GoodsReceipt.objects.all(), self.request)

    def list(self, request, *args, **kwargs):
        try:
            qs = self.get_queryset()
            data = self.serializer_class(qs, many=True).data
            return super().list(request, *args, **kwargs)
        except Exception as e:
            import traceback
            import os
            with open(os.path.join(os.path.dirname(__file__), 'goods_receipt_error.txt'), 'w') as f:
                f.write(traceback.format_exc())
            raise

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

class GoodsReceiptLineViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GoodsReceiptLineSerializer
    def get_queryset(self): return BaseService.filter_by_context(GoodsReceiptLine.objects.all(), self.request)

class StockMoveViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StockMoveSerializer
    def get_queryset(self): return BaseService.filter_by_context(StockMove.objects.all(), self.request)

class StockAdjustmentViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StockAdjustmentSerializer
    def get_queryset(self): return BaseService.filter_by_context(StockAdjustment.objects.all(), self.request)

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

class ReorderRuleViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReorderRuleSerializer
    def get_queryset(self): return BaseService.filter_by_context(ReorderRule.objects.all(), self.request)


class InventoryDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs_inv = BaseService.filter_by_context(InventoryItem.objects.all(), request)
        
        low_stock = sum(1 for i in qs_inv if i.is_low_stock)
        total_value = sum((i.unit_cost or 0) * i.quantity_on_hand for i in qs_inv)
        
        return standard_response(True, "Inventory Dashboard Data", {
            'total_items': qs_inv.count(),
            'low_stock_items': low_stock,
            'total_value': total_value,
        })
