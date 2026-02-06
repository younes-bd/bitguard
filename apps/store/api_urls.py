from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ProductViewSet, OrderViewSet, SubscriptionViewSet, SettingsViewSet, PlanViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'plans', PlanViewSet)
router.register(r'settings', SettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]
