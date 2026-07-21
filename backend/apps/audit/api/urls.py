# DEPRECATED - NOT MOUNTED - Use base_setup instead.
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditViewSet

router = DefaultRouter()
# Read-only routes for audit logs
router.register(r'logs', AuditViewSet, basename='auditlog')

urlpatterns = [
    path('', include(router.urls)),
]
