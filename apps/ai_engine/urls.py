from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalysisResultViewSet

router = DefaultRouter()
router.register(r'results', AnalysisResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
]