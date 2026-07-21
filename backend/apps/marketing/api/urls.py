from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, MarketingDashboardView, IntegrationViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'integrations', IntegrationViewSet, basename='integration')

from .views import MassMailingViewSet, SocialPostViewSet, SMSCampaignViewSet, EventViewSet, SurveyViewSet
router.register(r'mailings', MassMailingViewSet, basename='massmailing')
router.register(r'social-posts', SocialPostViewSet, basename='socialpost')
router.register(r'sms-campaigns', SMSCampaignViewSet, basename='smscampaign')
router.register(r'events', EventViewSet, basename='event')
router.register(r'surveys', SurveyViewSet, basename='survey')

urlpatterns = [
    path('dashboard/', MarketingDashboardView.as_view(), name='marketing-dashboard'),
    path('', include(router.urls)),
]
