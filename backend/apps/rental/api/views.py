from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.sale.domain.models import SaleOrder, SaleOrderLine
from .serializers import RentalOrderSerializer, RentalOrderLineSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class RentalOrderViewSet(viewsets.ModelViewSet):
    serializer_class = RentalOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['order_number']
    ordering_fields = ['date_order', 'status', 'amount_total']
    filterset_fields = ['status']

    def get_queryset(self):
        # We proxy to SaleOrder but only return ones flagged as rental orders
        return SaleOrder.objects.filter(
            tenant=self.request.user.tenant, 
            is_rental_order=True,
            is_deleted=False
        ).prefetch_related('lines')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant, 
            user=self.request.user,
            is_rental_order=True
        )

class RentalOrderLineViewSet(viewsets.ModelViewSet):
    serializer_class = RentalOrderLineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # We proxy to SaleOrderLine but only return rental lines
        return SaleOrderLine.objects.filter(
            order__tenant=self.request.user.tenant, 
            is_rental=True,
            is_deleted=False
        ).select_related('order')

    def perform_create(self, serializer):
        serializer.save(is_rental=True)
