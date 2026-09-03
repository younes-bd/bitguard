from django.urls import path
from .webhooks import twilio_webhook

urlpatterns = [
    path('webhook/twilio/', twilio_webhook, name='twilio-webhook'),
]
