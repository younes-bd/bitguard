from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.equity.domain.models import ShareClass, Shareholder
from apps.equity.api.serializers import ShareClassSerializer, ShareholderSerializer

class ShareClassViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ShareClass.objects.all()
    serializer_class = ShareClassSerializer

class ShareholderViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Shareholder.objects.all()
    serializer_class = ShareholderSerializer

