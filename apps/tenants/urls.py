from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import TenantViewSet

router = DefaultRouter()
router.register(r'tenant', TenantViewSet, basename='tenant')

urlpatterns = [
    path('', include(router.urls)),
]
