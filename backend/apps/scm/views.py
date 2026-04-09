"""SCM Views — Charter §8 compliant."""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import Vendor, InventoryItem, PurchaseOrder, PurchaseOrderLine
from .serializers import (
    VendorSerializer, InventoryItemSerializer,
    PurchaseOrderSerializer, PurchaseOrderLineSerializer,
)

class VendorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(Vendor.objects.all(), self.request)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Aggregated SCM KPIs for the dashboard."""
        qs_vendor = BaseService.filter_by_context(Vendor.objects.all(), request)
        qs_inv = BaseService.filter_by_context(InventoryItem.objects.all(), request)
        qs_po = BaseService.filter_by_context(PurchaseOrder.objects.all(), request)
        low_stock = sum(1 for i in qs_inv if i.is_low_stock)
        return Response({'status': 'success', 'data': {
            'vendors': qs_vendor.filter(status='active').count(),
            'inventory_count': qs_inv.count(),
            'pending_pos': qs_po.filter(status__in=['draft', 'sent']).count(),
            'low_stock': low_stock,
        }})

class InventoryItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InventoryItemSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(InventoryItem.objects.all(), self.request)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Returns all items at or below their reorder level."""
        items = [i for i in self.get_queryset() if i.is_low_stock]
        return Response(InventoryItemSerializer(items, many=True).data)

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseOrderSerializer

    def get_queryset(self):
        return BaseService.filter_by_context(PurchaseOrder.objects.prefetch_related('lines'), self.request)

    def perform_create(self, serializer):
        po = serializer.save(created_by=self.request.user)
        AuditService.log_action(self.request, action="SCM_PO_CREATED",
            resource=f"scm.PurchaseOrder:{po.pk}",
            payload={"vendor": po.vendor.name})

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        """Mark a PurchaseOrder as received and update inventory quantities."""
        from django.utils import timezone
        po = self.get_object()
        po.status = 'received'
        po.received_date = timezone.now().date()
        po.save(update_fields=['status', 'received_date'])
        # Restock inventory
        for line in po.lines.all():
            line.inventory_item.quantity_on_hand += line.quantity_ordered
            line.inventory_item.save(update_fields=['quantity_on_hand'])
            line.quantity_received = line.quantity_ordered
            line.save(update_fields=['quantity_received'])
        AuditService.log_action(request, action="SCM_PO_RECEIVED",
            resource=f"scm.PurchaseOrder:{po.pk}",
            payload={"vendor": po.vendor.name})
        return Response({'status': 'received'})

class PurchaseOrderLineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseOrderLineSerializer
    queryset = PurchaseOrderLine.objects.all()
