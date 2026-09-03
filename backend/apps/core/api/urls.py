from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AnalyticsViewSet, SequenceViewSet

router = DefaultRouter()
router.register(r'sequences', SequenceViewSet, basename='sequences')

urlpatterns = router.urls + [
    path('analytics/global/', AnalyticsViewSet.as_view({'get': 'global_metrics'}), name='core-global-metrics'),
]
