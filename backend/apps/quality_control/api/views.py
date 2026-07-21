from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.quality_control.domain.models import QualityAlert, QualityPoint, QualityCheck
from .serializers import QualityAlertSerializer, QualityPointSerializer, QualityCheckSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class QualityAlertViewSet(viewsets.ModelViewSet):
    serializer_class = QualityAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['priority', 'state']
    filterset_fields = ['state', 'priority']

    def get_queryset(self):
        return QualityAlert.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('user')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            user=self.request.user,
            created_by=self.request.user
        )

class QualityPointViewSet(viewsets.ModelViewSet):
    serializer_class = QualityPointSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'operation']
    ordering_fields = ['title', 'operation']

    def get_queryset(self):
        return QualityPoint.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            created_by=self.request.user
        )

class QualityCheckViewSet(viewsets.ModelViewSet):
    serializer_class = QualityCheckSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['lot_name', 'note']
    ordering_fields = ['result']
    filterset_fields = ['result']

    def get_queryset(self):
        return QualityCheck.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('point')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            created_by=self.request.user
        )
