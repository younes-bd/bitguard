from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QualityAlertViewSet, QualityPointViewSet, QualityCheckViewSet

router = DefaultRouter()
router.register(r'alerts', QualityAlertViewSet, basename='quality-alert')
router.register(r'points', QualityPointViewSet, basename='quality-point')
router.register(r'checks', QualityCheckViewSet, basename='quality-check')

urlpatterns = [
    path('', include(router.urls)),
]
