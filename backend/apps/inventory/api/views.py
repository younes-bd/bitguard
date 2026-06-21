"""Inventory Views"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from ..domain.models import Warehouse, InventoryItem, GoodsReceipt, GoodsReceiptLine, StockMove, StockAdjustment, ReorderRule, DeliveryNote
from .serializers import (
    WarehouseSerializer, InventoryItemSerializer, GoodsReceiptSerializer, GoodsReceiptLineSerializer,
    StockMoveSerializer, StockAdjustmentSerializer, ReorderRuleSerializer, DeliveryNoteSerializer
)

class WarehouseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WarehouseSerializer
    def get_queryset(self):
        return BaseService.filter_by_context(Warehouse.objects.all(), self.request)

class InventoryItemViewSet(viewsets.ModelViewSet):
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

class GoodsReceiptViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GoodsReceiptSerializer
    def get_queryset(self): return BaseService.filter_by_context(GoodsReceipt.objects.all(), self.request)

class GoodsReceiptLineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GoodsReceiptLineSerializer
    def get_queryset(self): return BaseService.filter_by_context(GoodsReceiptLine.objects.all(), self.request)

class StockMoveViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StockMoveSerializer
    def get_queryset(self): return BaseService.filter_by_context(StockMove.objects.all(), self.request)

class StockAdjustmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StockAdjustmentSerializer
    def get_queryset(self): return BaseService.filter_by_context(StockAdjustment.objects.all(), self.request)

class ReorderRuleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReorderRuleSerializer
    def get_queryset(self): return BaseService.filter_by_context(ReorderRule.objects.all(), self.request)

class DeliveryNoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeliveryNoteSerializer
    def get_queryset(self): return BaseService.filter_by_context(DeliveryNote.objects.all(), self.request)

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
