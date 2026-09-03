from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from rest_framework import permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.quality_control.domain.models import QualityAlert, QualityPoint, QualityCheck
from .serializers import QualityAlertSerializer, QualityPointSerializer, QualityCheckSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class QualityAlertViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = QualityAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['priority', 'state']
    filterset_fields = ['state', 'priority']

    def get_queryset(self):
        return super().get_queryset().select_related('user')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            user=self.request.user,
            created_by=self.request.user
        )

class QualityPointViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = QualityPointSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'operation']
    ordering_fields = ['title', 'operation']

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            created_by=self.request.user
        )

class QualityCheckViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = QualityCheckSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['lot_name', 'note']
    ordering_fields = ['result']
    filterset_fields = ['result']

    def get_queryset(self):
        return super().get_queryset().select_related('point')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            created_by=self.request.user
        )
