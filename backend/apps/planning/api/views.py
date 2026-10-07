from apps.base.api.mixins import TenantScopedMixin
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.planning.domain.models import Shift, PlanningRole, ShiftTemplate
from apps.planning.api.serializers import ShiftSerializer, PlanningRoleSerializer, ShiftTemplateSerializer

class PlanningRoleViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = PlanningRoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PlanningRole.objects.filter(tenant=getattr(self.request, 'tenant', None))
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

class ShiftTemplateViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ShiftTemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShiftTemplate.objects.filter(tenant=getattr(self.request, 'tenant', None))
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

class ShiftViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Shift.objects.filter(tenant=getattr(self.request, 'tenant', None))
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))
