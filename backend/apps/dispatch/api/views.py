from apps.base.api.mixins import TenantScopedMixin
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..domain.models import FieldIntervention
from .serializers import FieldInterventionSerializer

class FieldInterventionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = FieldInterventionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        from apps.base.services.core import BaseService
        return BaseService.filter_by_context(FieldIntervention.objects.all(), self.request)
