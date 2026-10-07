from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .webhooks import twilio_webhook
from apps.journeys.api.views import SMSCampaignViewSet

router = DefaultRouter()
router.register(r'campaigns', SMSCampaignViewSet, basename='smscampaign')

urlpatterns = [
    path('', include(router.urls)),
    path('webhook/twilio/', twilio_webhook, name='twilio-webhook'),
]
