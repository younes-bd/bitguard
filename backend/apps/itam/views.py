from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Asset, AssetAssignment, MaintenanceRecord
from .serializers import AssetListSerializer, AssetDetailSerializer, AssetAssignmentSerializer, MaintenanceRecordSerializer


class AssetViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = Asset.objects.select_related('client', 'assigned_to')
        if tenant:
            qs = qs.filter(tenant=tenant)
        # Filter by type/status
        asset_type = self.request.query_params.get('type')
        status = self.request.query_params.get('status')
        if asset_type:
            qs = qs.filter(asset_type=asset_type)
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return AssetListSerializer
        return AssetDetailSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs = self.get_queryset()
        return Response({
            'total': qs.count(),
            'active': qs.filter(status='active').count(),
            'maintenance': qs.filter(status='maintenance').count(),
            'retired': qs.filter(status='retired').count(),
            'by_type': {
                t[0]: qs.filter(asset_type=t[0]).count()
                for t in Asset.TYPE_CHOICES
                if qs.filter(asset_type=t[0]).exists()
            },
        })


class AssetAssignmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AssetAssignmentSerializer

    def get_queryset(self):
        return AssetAssignment.objects.select_related('asset', 'assigned_to').all()


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MaintenanceRecordSerializer

    def get_queryset(self):
        return MaintenanceRecord.objects.select_related('asset', 'performed_by').all()
