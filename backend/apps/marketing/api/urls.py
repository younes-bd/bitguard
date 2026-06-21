from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, MarketingDashboardView, IntegrationViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'integrations', IntegrationViewSet, basename='integration')

urlpatterns = [
    path('dashboard/', MarketingDashboardView.as_view(), name='marketing-dashboard'),
    path('', include(router.urls)),
]
