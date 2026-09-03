from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..domain.models import (
    StoreCustomization, LicenseKey, CustomerProfile,
    Order, ShippingSetting, TrackingConfig, AddOn, SubscriptionPlan, Subscription, StoreSetting, PartnerRequest, Cart, CartItem, Coupon
)
from ..api.serializers import (
    StoreCustomizationSerializer, LicenseKeySerializer,
    CustomerProfileSerializer, OrderSerializer, ShippingSettingSerializer,
    TrackingConfigSerializer, AddOnSerializer, SubscriptionPlanSerializer, SubscriptionSerializer, StoreSettingSerializer, PartnerRequestSerializer, CartSerializer, CartItemSerializer, CouponSerializer
)
from ..application.services import CommerceService

class StoreCustomizationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = StoreCustomization.objects.all()
    serializer_class = StoreCustomizationSerializer
    permission_classes = [permissions.IsAuthenticated]



class LicenseKeyViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = LicenseKeySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return LicenseKey.objects.filter(tenant=self.request.user.tenant)
        return LicenseKey.objects.none()

class CustomerProfileViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return CustomerProfile.objects.filter(tenant=self.request.user.tenant)
        return CustomerProfile.objects.none()

class OrderViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return Order.objects.filter(tenant=self.request.user.tenant).order_by('-created_at')
        return Order.objects.none()

    def perform_create(self, serializer):
        CommerceService.create_order(serializer.validated_data, self.request)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({"error": "status is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        CommerceService.update_order_status(order, new_status, request)
        return Response({"status": "updated", "new_status": new_status})

class ShippingSettingViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ShippingSetting.objects.all()
    serializer_class = ShippingSettingSerializer
    permission_classes = [permissions.IsAuthenticated]


class TrackingConfigViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = TrackingConfig.objects.all()
    serializer_class = TrackingConfigSerializer
    permission_classes = [permissions.IsAuthenticated]

class AddOnViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = AddOn.objects.all()
    serializer_class = AddOnSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubscriptionPlanViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubscriptionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        CommerceService.create_subscription(serializer.validated_data, self.request)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        sub = self.get_object()
        sub.status = 'cancelled'
        sub.save()
        return Response({'status': 'Subscription cancelled'})

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        sub = self.get_object()
        sub.status = 'paused'
        sub.save()
        return Response({'status': 'Subscription paused'})

    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        sub = self.get_object()
        sub.status = 'active'
        sub.save()
        return Response({'status': 'Subscription resumed'})

class CartViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        session_id = self.request.query_params.get('session_id')
        if session_id:
            return Cart.objects.filter(session_id=session_id)
        return Cart.objects.none()

class CouponViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return Coupon.objects.filter(tenant=self.request.user.tenant)
        return Coupon.objects.all()

class StoreSettingViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = StoreSetting.objects.all()
    serializer_class = StoreSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

class PartnerRequestViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PartnerRequest.objects.all().order_by('-created_at')
    serializer_class = PartnerRequestSerializer
    permission_classes = [permissions.AllowAny] # Allow public submission





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class RevenueReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        from apps.ecommerce.domain.models import Order
        from django.db.models import Sum, Count
        orders = Order.objects.all()
        if tenant: orders = orders.filter(tenant=tenant)
        result = {
            "store_revenue": float(orders.filter(status='completed').aggregate(t=Sum('total_amount'))['t'] or 0),
            "total_orders": orders.count(),
            "avg_order_value": float(orders.filter(status='completed').aggregate(t=Sum('total_amount'))['t'] or 0) / (orders.count() or 1)
        }
        return Response({"status": "success", "data": result})

class ExportRevenueCSV(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        import csv
        from django.http import HttpResponse
        from apps.ecommerce.domain.models import Order
        from django.db.models import Sum
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="revenue_export.csv"'
        writer = csv.writer(response)
        tenant = getattr(request, 'tenant', None)
        writer.writerow(['Type', 'Amount'])
        orders = Order.objects.all()
        if tenant: orders = orders.filter(tenant=tenant)
        store_rev = float(orders.filter(status='completed').aggregate(total=Sum('total_amount'))['total'] or 0)
        writer.writerow(['Store Revenue', store_rev])
        return response

