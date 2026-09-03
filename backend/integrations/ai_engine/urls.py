from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AISettingsViewSet, AIUsageLogViewSet

router = DefaultRouter()
router.register(r'settings', AISettingsViewSet, basename='ai-settings')
router.register(r'logs', AIUsageLogViewSet, basename='ai-logs')

urlpatterns = [
    path('', include(router.urls)),
]
