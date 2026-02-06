from rest_framework import routers
from django.urls import path, include
from .api_views import WorkflowViewSet

# URLs
router = routers.DefaultRouter()
router.register(r'workflows', WorkflowViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
