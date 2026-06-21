from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..domain.models import SaleOrder, SaleOrderLine
from .serializers import SaleOrderSerializer, SaleOrderLineSerializer
from ..application.services import SaleOrderService

class SaleOrderViewSet(viewsets.ModelViewSet):
    serializer_class = SaleOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter by tenant
        return SaleOrder.objects.filter(tenant__users=self.request.user)

    def perform_create(self, serializer):
        tenant = self.request.user.tenantmembership_set.first().tenant
        serializer.save(tenant=tenant)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        order = self.get_object()
        try:
            confirmed_order = SaleOrderService.confirm_order(request, order)
            serializer = self.get_serializer(confirmed_order)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SaleOrderLineViewSet(viewsets.ModelViewSet):
    serializer_class = SaleOrderLineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SaleOrderLine.objects.filter(tenant__users=self.request.user)

    def perform_create(self, serializer):
        tenant = self.request.user.tenantmembership_set.first().tenant
        serializer.save(tenant=tenant)
