from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..domain.models import (
    StoreCustomization, Category, Product, LicenseKey, CustomerProfile,
    Order, ShippingSetting, LandingPage, TrackingConfig, AddOn, SubscriptionPlan, Subscription, StoreSetting, PartnerRequest, Cart, CartItem, Coupon
)
from ..api.serializers import (
    StoreCustomizationSerializer, CategorySerializer, ProductSerializer, LicenseKeySerializer,
    CustomerProfileSerializer, OrderSerializer, ShippingSettingSerializer, LandingPageSerializer,
    TrackingConfigSerializer, AddOnSerializer, SubscriptionPlanSerializer, SubscriptionSerializer, StoreSettingSerializer, PartnerRequestSerializer, CartSerializer, CartItemSerializer, CouponSerializer
)
from ..application.services import CommerceService

class StoreCustomizationViewSet(viewsets.ModelViewSet):
    queryset = StoreCustomization.objects.all()
    serializer_class = StoreCustomizationSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        CommerceService.create_category(serializer.validated_data, self.request)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def checkout(self, request, pk=None):
        product = self.get_object()
        success_url = request.data.get('success_url') or request.build_absolute_uri('/')
        cancel_url = request.data.get('cancel_url') or request.build_absolute_uri('/')

        checkout_url = CommerceService.create_checkout_session(
            user=request.user,
            product=product,
            success_url=success_url,
            cancel_url=cancel_url,
            request=request
        )
        return Response({'checkout_url': checkout_url})

    def perform_create(self, serializer):
        CommerceService.create_product(serializer.validated_data, self.request)

class LicenseKeyViewSet(viewsets.ModelViewSet):
    serializer_class = LicenseKeySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return LicenseKey.objects.filter(tenant=self.request.user.tenant)
        return LicenseKey.objects.none()

class CustomerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return CustomerProfile.objects.filter(tenant=self.request.user.tenant)
        return CustomerProfile.objects.none()

class OrderViewSet(viewsets.ModelViewSet):
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

class ShippingSettingViewSet(viewsets.ModelViewSet):
    queryset = ShippingSetting.objects.all()
    serializer_class = ShippingSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

class LandingPageViewSet(viewsets.ModelViewSet):
    queryset = LandingPage.objects.all()
    serializer_class = LandingPageSerializer
    permission_classes = [permissions.IsAuthenticated]

class TrackingConfigViewSet(viewsets.ModelViewSet):
    queryset = TrackingConfig.objects.all()
    serializer_class = TrackingConfigSerializer
    permission_classes = [permissions.IsAuthenticated]

class AddOnViewSet(viewsets.ModelViewSet):
    queryset = AddOn.objects.all()
    serializer_class = AddOnSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubscriptionViewSet(viewsets.ModelViewSet):
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

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        session_id = self.request.query_params.get('session_id')
        if session_id:
            return Cart.objects.filter(session_id=session_id)
        return Cart.objects.none()

class CouponViewSet(viewsets.ModelViewSet):
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return Coupon.objects.filter(tenant=self.request.user.tenant)
        return Coupon.objects.all()

class StoreSettingViewSet(viewsets.ModelViewSet):
    queryset = StoreSetting.objects.all()
    serializer_class = StoreSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

class PartnerRequestViewSet(viewsets.ModelViewSet):
    queryset = PartnerRequest.objects.all().order_by('-created_at')
    serializer_class = PartnerRequestSerializer
    permission_classes = [permissions.AllowAny] # Allow public submission
