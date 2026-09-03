from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.mrp.domain.models import (
    WorkCenter, Routing, RoutingOperation, BillOfMaterial, BillOfMaterialLine,
    ManufacturingOrder, WorkOrder, ScrapOrder
)
from .serializers import (
    WorkCenterSerializer, RoutingSerializer, RoutingOperationSerializer,
    BillOfMaterialSerializer, BillOfMaterialLineSerializer,
    ManufacturingOrderSerializer, WorkOrderSerializer, ScrapOrderSerializer
)

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class WorkCenterViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = WorkCenterSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'code']

    def get_queryset(self):
        return WorkCenter.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class RoutingViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = RoutingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Routing.objects.filter(tenant=self.request.user.tenant, is_deleted=False)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class BillOfMaterialViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = BillOfMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return BillOfMaterial.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class WorkOrderViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = WorkOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return WorkOrder.objects.filter(tenant=self.request.user.tenant, is_deleted=False)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class ScrapOrderViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ScrapOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ScrapOrder.objects.filter(tenant=self.request.user.tenant, is_deleted=False)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class ManufacturingOrderViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ManufacturingOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['date_planned_start', 'state']
    filterset_fields = ['state']

    def get_queryset(self):
        return ManufacturingOrder.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('bom')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        order = self.get_object()
        if order.state != 'draft':
            return Response({'error': 'Order must be in draft state'}, status=400)
            
        order.state = 'confirmed'
        order.save()
        
        # Create work orders from routing
        if order.routing:
            for op in order.routing.operations.all():
                WorkOrder.objects.create(
                    tenant=order.tenant,
                    manufacturing_order=order,
                    operation=op,
                    work_center=op.work_center,
                    name=op.name,
                    sequence=op.sequence,
                    duration_expected=op.duration_expected
                )
        return Response({'status': order.state})

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        order = self.get_object()
        if order.state != 'confirmed':
            return Response({'error': 'Order must be confirmed first'}, status=400)
            
        order.state = 'in_progress'
        order.save()
        return Response({'status': order.state})

    @action(detail=True, methods=['post'])
    def produce(self, request, pk=None):
        order = self.get_object()
        order.state = 'done'
        order.save()
        
        # Trigger Stock Movement
        from apps.stock.domain.models import StockMovement, InventoryItem
        try:
            item = InventoryItem.objects.filter(id=order.product_id).first()
            if item:
                StockMovement.objects.create(
                    tenant=order.tenant,
                    item=item,
                    movement_type='in',
                    quantity=order.qty_to_produce,
                    reference=f"MO-{order.id}",
                    status='completed'
                )
                item.quantity_on_hand += order.qty_to_produce
                item.save()
        except Exception as e:
            pass
            
        return Response({'status': order.state})
        
    @action(detail=True, methods=['get'], url_path='work-orders')
    def work_orders(self, request, pk=None):
        order = self.get_object()
        work_orders = WorkOrder.objects.filter(manufacturing_order=order)
        serializer = WorkOrderSerializer(work_orders, many=True)
        return Response(serializer.data)
