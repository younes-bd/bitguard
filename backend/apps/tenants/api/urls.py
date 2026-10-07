from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet, SecurityPolicyViewSet

router = DefaultRouter()
router.register(r'security-policy', SecurityPolicyViewSet, basename='security-policy')
router.register(r'', TenantViewSet, basename='tenant')

urlpatterns = [
    path('', include(router.urls)),
]
