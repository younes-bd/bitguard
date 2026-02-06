from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Order, Subscription, StoreSettings, Plan
from .serializers import ProductSerializer, OrderSerializer, SubscriptionSerializer, StoreSettingsSerializer, PlanSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Open fetch, protected write

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin sees all, user sees own
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny] # Public plans


class SubscriptionViewSet(viewsets.ModelViewSet): # Admin can manage subscriptions
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAdminUser]

class SettingsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    def list(self, request):
        # Singleton pattern: Get the first or create default
        settings, created = StoreSettings.objects.get_or_create(id=1) # Simple singleton
        serializer = StoreSettingsSerializer(settings)
        return Response(serializer.data)

    def create(self, request):
        # Handle update via POST
        settings, created = StoreSettings.objects.get_or_create(id=1)
        serializer = StoreSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
