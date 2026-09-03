from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api.views import AgentProfileViewSet, AgentRunLogViewSet

router = DefaultRouter()
router.register(r'profiles', AgentProfileViewSet, basename='agent-profile')
router.register(r'logs', AgentRunLogViewSet, basename='agent-log')

urlpatterns = [
    path('', include(router.urls)),
]
