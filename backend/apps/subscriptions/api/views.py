from apps.core.api.mixins import TenantScopedMixin
import json
from django.conf import settings
from django.http import HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from datetime import datetime, timezone as dt_timezone

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..domain.models import Plan, Subscription, BillingSettings
from ..api.serializers import (
    PlanSerializer, SubscriptionSerializer, BillingSettingsSerializer
)


class PlanViewSet(TenantScopedMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.filter(is_active=True).order_by('price_monthly')
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def subscribe(self, request, pk=None):
        from apps.subscriptions.application.services import SubscriptionService
        plan = self.get_object()
        interval = request.data.get('interval', 'monthly')
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        
        try:
            checkout_url = SubscriptionService.subscribe_plan(plan, request.user, interval, frontend_url)
            return Response({'checkout_url': checkout_url})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': f'Stripe error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubscriptionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_staff:
            qs = qs.filter(user=self.request.user)
        return qs

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a subscription at period end via Stripe."""
        sub = self.get_object()
        try:
            import stripe
            stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', None)
            if sub.stripe_subscription_id and stripe.api_key:
                stripe.Subscription.modify(sub.stripe_subscription_id, cancel_at_period_end=True)
            sub.cancel_at_period_end = True
            sub.save(update_fields=['cancel_at_period_end'])
            return Response({'status': 'Subscription will be cancelled at period end.'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class SettingsViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = BillingSettings.objects.all()
    serializer_class = BillingSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(View):
    """
    Stripe calls this endpoint after payment events.
    Must be CSRF-exempt — Stripe signs requests with STRIPE_WEBHOOK_SECRET instead.
    """

    def post(self, request):
        from apps.subscriptions.application.services import SubscriptionService
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', None)
        
        try:
            import stripe
            stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', None)
            SubscriptionService.process_webhook(payload, sig_header, webhook_secret)
            return HttpResponse(status=200)
        except (ValueError, Exception) as e:
            return HttpResponse(f'Webhook error: {e}', status=400)
