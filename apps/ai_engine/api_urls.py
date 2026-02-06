from rest_framework import routers
from django.urls import path, include
from .api_views import AnalysisResultViewSet

# URLs
router = routers.DefaultRouter()
router.register(r'results', AnalysisResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
