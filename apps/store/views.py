from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Order, Subscription, StoreSettings, Plan
from .serializers import (
    ProductSerializer, OrderSerializer, SubscriptionSerializer, 
    StoreSettingsSerializer, PlanSerializer
)
from .services import CommerceService, SubscriptionService
from apps.core.permissions import ConstitutionPermission
from apps.core.services.audit import AuditService

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [ConstitutionPermission]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def checkout(self, request, pk=None):
        product = self.get_object()
        success_url = request.data.get('success_url') or request.build_absolute_uri('/')
        cancel_url = request.data.get('cancel_url') or request.build_absolute_uri('/')

        AuditService.log(
            request,
            action="CHECKOUT_INITIATED",
            resource=f"store.Product:{product.pk}",
            payload={"product_name": product.name}
        )

        checkout_url = CommerceService.create_checkout_session(
            user=request.user,
            product=product,
            success_url=success_url,
            cancel_url=cancel_url,
            request=request
        )
        
        return Response({'checkout_url': checkout_url})

    def perform_create(self, serializer):
        product = serializer.save()
        AuditService.log(
            self.request,
            action="STORE_PRODUCT_CREATED",
            resource=f"store.Product:{product.pk}",
            payload=serializer.data
        )

class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.filter(is_active=True).order_by('price_monthly')
    serializer_class = PlanSerializer
    permission_classes = [ConstitutionPermission]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def subscribe(self, request, pk=None):
        plan = self.get_object()
        success_url = request.data.get('success_url') or request.build_absolute_uri('/')
        cancel_url = request.data.get('cancel_url') or request.build_absolute_uri('/')

        AuditService.log(
            request,
            action="SUBSCRIPTION_INITIATED",
            resource=f"store.Plan:{plan.pk}",
            payload={"plan_name": plan.name}
        )

        checkout_url = SubscriptionService.create_subscription_session(
            user=request.user,
            plan=plan,
            success_url=success_url,
            cancel_url=cancel_url,
            request=request
        )
        
        return Response({'checkout_url': checkout_url})

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [ConstitutionPermission]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [ConstitutionPermission]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Subscription.objects.all()
        return Subscription.objects.filter(user=user)

class SettingsViewSet(viewsets.ViewSet):
    permission_classes = [ConstitutionPermission]

    def list(self, request):
        settings_obj, created = StoreSettings.objects.get_or_create(id=1)
        serializer = StoreSettingsSerializer(settings_obj)
        return Response(serializer.data)

    def create(self, request):
        settings_obj, created = StoreSettings.objects.get_or_create(id=1)
        serializer = StoreSettingsSerializer(settings_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            AuditService.log(
                request,
                action="STORE_SETTINGS_UPDATED",
                resource="store.StoreSettings:1",
                payload=request.data
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
