from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.mrp_plm.domain.models import EngineeringChangeOrder, ECOType
from .serializers import EngineeringChangeOrderSerializer, ECOTypeSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class EngineeringChangeOrderViewSet(viewsets.ModelViewSet):
    serializer_class = EngineeringChangeOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'note']
    ordering_fields = ['state']
    filterset_fields = ['state']

    def get_queryset(self):
        return EngineeringChangeOrder.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('responsible')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            responsible=self.request.user,
            created_by=self.request.user
        )

class ECOTypeViewSet(viewsets.ModelViewSet):
    serializer_class = ECOTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['sequence']

    def get_queryset(self):
        return ECOType.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            created_by=self.request.user
        )

