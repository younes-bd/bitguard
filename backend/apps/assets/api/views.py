from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from ..api.serializers import AssetListSerializer, AssetDetailSerializer, AssetAssignmentSerializer, MaintenanceRecordSerializer, SoftwareLicenseSerializer
from ..domain.models import Asset, AssetAssignment, MaintenanceRecord, SoftwareLicense


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


class ItamDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tenant = getattr(request.user, 'tenant', None)
        qs = Asset.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
            
        return standard_response(True, "ITAM Dashboard Data", {
            'total': qs.count(),
            'active': qs.filter(status='active').count(),
            'maintenance': qs.filter(status='maintenance').count(),
            'retired': qs.filter(status='retired').count(),
            'by_type': {
                t[0]: qs.filter(asset_type=t[0]).count()
                for t in Asset.TYPE_CHOICES
                if qs.filter(asset_type=t[0]).exists()
            },
            'recent_maintenance': [], # Add query for recent maintenance records if needed
        })

class SoftwareLicenseViewSet(viewsets.ModelViewSet):
    serializer_class = SoftwareLicenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SoftwareLicense.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

import datetime
from django.utils import timezone

class AssetDepreciationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        assets = Asset.objects.filter(
            tenant=request.user.tenant,
            purchase_date__isnull=False,
            purchase_price__isnull=False
        )
        data = []
        today = timezone.now().date()
        for asset in assets:
            useful_life_years = 5  # default
            years_owned = (today - asset.purchase_date).days / 365.25
            annual_depreciation = float(asset.purchase_price) / useful_life_years
            accumulated = min(annual_depreciation * years_owned, float(asset.purchase_price))
            book_value = max(float(asset.purchase_price) - accumulated, 0)
            data.append({
                'id': str(asset.id),
                'name': asset.name,
                'asset_tag': asset.asset_tag,
                'purchase_date': asset.purchase_date,
                'purchase_price': float(asset.purchase_price),
                'useful_life_years': useful_life_years,
                'annual_depreciation': round(annual_depreciation, 2),
                'accumulated_depreciation': round(accumulated, 2),
                'book_value': round(book_value, 2),
                'method': 'straight_line',
            })
        return Response(data)
