from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.core.services.command_center import CommandCenterAnalyticsService

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def global_metrics(self, request):
        tenant = getattr(request.user, 'tenant', None)
        date_range = request.query_params.get('range', '30days')
        
        # Call the Orchestrator Service (Tier-1 Standard)
        metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=tenant, date_range=date_range)
        
        return Response(metrics)

from ..domain.models import Sequence
from .serializers import SequenceSerializer
from apps.core.api.mixins import TenantScopedMixin

class SequenceViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Sequence.objects.all()
    serializer_class = SequenceSerializer
    permission_classes = [permissions.IsAuthenticated]

