from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, MarketingDashboardView

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')

urlpatterns = [
    path('dashboard/', MarketingDashboardView.as_view(), name='marketing-dashboard'),
    path('', include(router.urls)),
]
