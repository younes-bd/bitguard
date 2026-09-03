from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.esg.domain.models import EsgMetric, EsgTarget
from apps.esg.api.serializers import EsgMetricSerializer, EsgTargetSerializer

class EsgMetricViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = EsgMetric.objects.all()
    serializer_class = EsgMetricSerializer

class EsgTargetViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = EsgTarget.objects.all()
    serializer_class = EsgTargetSerializer

