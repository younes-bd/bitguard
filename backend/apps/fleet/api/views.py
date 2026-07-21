from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.fleet.domain.models import Vehicle, VehicleLog, VehicleContract
from .serializers import VehicleSerializer, VehicleLogSerializer, VehicleContractSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'license_plate', 'state']
    ordering_fields = ['name', 'acquisition_date', 'state']
    filterset_fields = ['state']

    def get_queryset(self):
        return Vehicle.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('driver')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def add_maintenance(self, request, pk=None):
        vehicle = self.get_object()
        cost = request.data.get('cost', 0)
        desc = request.data.get('description', 'Maintenance')
        log = VehicleLog.objects.create(
            tenant=getattr(request, 'tenant', None),
            vehicle=vehicle,
            log_type='service',
            description=desc,
            cost=cost
        )
        
        # General Ledger
        if float(cost) > 0:
            from apps.accounting.application.services import GeneralLedgerService
            try:
                GeneralLedgerService.record_entry(
                    request, "Maintenance Expense", float(cost), 'debit',
                    log.pk, 'fleet_log', f"Maintenance for {vehicle.name}"
                )
            except Exception:
                pass
                
        return Response({'status': 'maintenance_added', 'log_id': log.id})

    @action(detail=True, methods=['post'])
    def add_fuel(self, request, pk=None):
        vehicle = self.get_object()
        cost = request.data.get('cost', 0)
        desc = request.data.get('description', 'Fuel')
        log = VehicleLog.objects.create(
            tenant=getattr(request, 'tenant', None),
            vehicle=vehicle,
            log_type='fuel',
            description=desc,
            cost=cost
        )
        
        # General Ledger
        if float(cost) > 0:
            from apps.accounting.application.services import GeneralLedgerService
            try:
                GeneralLedgerService.record_entry(
                    request, "Fuel Expense", float(cost), 'debit',
                    log.pk, 'fleet_log', f"Fuel for {vehicle.name}"
                )
            except Exception:
                pass
                
        return Response({'status': 'fuel_added', 'log_id': log.id})

class VehicleLogViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return VehicleLog.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('vehicle')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class VehicleContractViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return VehicleContract.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('vehicle')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)
