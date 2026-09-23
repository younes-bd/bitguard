from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.automation.api.views import AutomatedActionViewSet, WebhookEndpointViewSet

router = DefaultRouter()
router.register(r'actions', AutomatedActionViewSet, basename='automation-actions')
router.register(r'webhook-endpoints', WebhookEndpointViewSet, basename='automation-webhooks')

urlpatterns = [
    path('', include(router.urls)),
]
