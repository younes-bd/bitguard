from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from apps.pos.domain.models import PosConfig, PosSession, PosOrder, PosPayment, RestaurantFloor, RestaurantTable, RestaurantPrinter
from .serializers import PosConfigSerializer, PosSessionSerializer, PosOrderSerializer, PosPaymentSerializer, RestaurantFloorSerializer, RestaurantTableSerializer, RestaurantPrinterSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class PosConfigViewSet(viewsets.ModelViewSet):
    serializer_class = PosConfigSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PosConfig.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class PosSessionViewSet(viewsets.ModelViewSet):
    serializer_class = PosSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['start_at', 'state']
    filterset_fields = ['state']

    def get_queryset(self):
        return PosSession.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('config', 'user')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            user=self.request.user,
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def open(self, request, pk=None):
        session = self.get_object()
        balance_start = request.data.get('cash_register_balance_start')
        if balance_start is not None:
            session.cash_register_balance_start = balance_start
        session.state = 'opened'
        session.save()
        return Response({'status': session.state, 'cash_register_balance_start': session.cash_register_balance_start})

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        from django.utils import timezone
        session = self.get_object()
        
        balance_end_real = request.data.get('cash_register_balance_end_real')
        if balance_end_real is not None:
            session.cash_register_balance_end_real = balance_end_real
            
        session.state = 'closed'
        session.stop_at = timezone.now()
        session.save()
        
        # General Ledger entries
        from apps.accounting.application.services import GeneralLedgerService
        total_sales = sum(order.amount_total for order in session.orders.filter(state__in=['paid', 'done', 'invoiced']))
        if total_sales > 0:
            try:
                GeneralLedgerService.record_entry(
                    request, "Cash", total_sales, 'debit',
                    session.pk, 'pos_session', f"POS Session {session.id} closing"
                )
                GeneralLedgerService.record_entry(
                    request, "Sales Revenue", total_sales, 'credit',
                    session.pk, 'pos_session', f"POS Session {session.id} closing"
                )
            except Exception:
                pass
                
        return Response({'status': session.state})

class PosOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PosOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['state']

    def get_queryset(self):
        return PosOrder.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('session')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class PosPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PosPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PosPayment.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class RestaurantFloorViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantFloorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RestaurantFloor.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class RestaurantTableViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantTableSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RestaurantTable.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class RestaurantPrinterViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantPrinterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RestaurantPrinter.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)
