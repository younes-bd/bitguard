from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet, SubscriptionViewSet, SettingsViewSet, PlanViewSet
from .webhook import stripe_webhook

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'plans', PlanViewSet)
router.register(r'settings', SettingsViewSet, basename='settings')

urlpatterns = [
    path('webhook/stripe/', stripe_webhook, name='stripe_webhook'),
    path('', include(router.urls)),
]
