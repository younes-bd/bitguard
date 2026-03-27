from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SystemSettingViewSet, AuditTrailViewSet

router = DefaultRouter()
router.register(r'settings', SystemSettingViewSet, basename='sysadmin-setting')
router.register(r'audit-logs', AuditTrailViewSet, basename='sysadmin-audit')

urlpatterns = [
    path('', include(router.urls)),
]
