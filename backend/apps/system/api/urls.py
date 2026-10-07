from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import EmailConfigViewSet, IntegrationKeyViewSet

router = DefaultRouter()
router.register(r'integration-keys', IntegrationKeyViewSet, basename='settings-integration-keys')
router.register(r'email-config', EmailConfigViewSet, basename='settings-email-config')

urlpatterns = [
    path('', include(router.urls)),
]
