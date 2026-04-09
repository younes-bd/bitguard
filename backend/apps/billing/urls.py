from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, PlanViewSet, SubscriptionViewSet, SettingsViewSet, StripeWebhookView

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'plans', PlanViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'settings', SettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
    # Stripe Webhook — CSRF-exempt, verified by Stripe signature
    path('webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
]
