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
from .models import Order, Plan, Subscription, BillingSettings
from .serializers import (
    OrderSerializer, PlanSerializer, SubscriptionSerializer, BillingSettingsSerializer
)


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.filter(is_active=True).order_by('price_monthly')
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def subscribe(self, request, pk=None):
        """
        Creates a Stripe Checkout Session for the selected plan.
        Returns a checkout_url for the frontend to redirect to.
        """
        plan = self.get_object()
        interval = request.data.get('interval', 'monthly')

        stripe_price_id = (
            plan.stripe_price_id_monthly if interval == 'monthly'
            else plan.stripe_price_id_yearly
        )

        if not stripe_price_id:
            return Response(
                {'error': 'No Stripe price configured for this plan.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            import stripe
            stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', None)

            if not stripe.api_key:
                return Response(
                    {'error': 'Stripe is not configured on this server. Set STRIPE_SECRET_KEY in environment variables.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')

            checkout_session = stripe.checkout.Session.create(
                mode='subscription',
                line_items=[{'price': stripe_price_id, 'quantity': 1}],
                success_url=f"{frontend_url}/admin/billing/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{frontend_url}/admin/billing/cancel",
                customer_email=request.user.email,
                metadata={
                    'user_id': str(request.user.id),
                    'plan_id': str(plan.id),
                    'interval': interval,
                },
                client_reference_id=str(request.user.id),
            )

            return Response({'checkout_url': checkout_session.url})

        except ImportError:
            return Response(
                {'error': 'Stripe SDK not installed. Run: pip install stripe'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {'error': f'Stripe error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_staff:
            qs = qs.filter(user=self.request.user)
        return qs


class SubscriptionViewSet(viewsets.ModelViewSet):
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



class SettingsViewSet(viewsets.ModelViewSet):
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
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', None)

        try:
            import stripe
            stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', None)

            if webhook_secret:
                event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
            else:
                # Dev fallback — no signature verification (never in production)
                event = stripe.Event.construct_from(json.loads(payload), stripe.api_key)
        except (ValueError, Exception) as e:
            return HttpResponse(f'Webhook error: {e}', status=400)

        event_type = event['type']
        data = event['data']['object']

        # ── checkout.session.completed ────────────────────────────────────
        if event_type == 'checkout.session.completed':
            stripe_sub_id = data.get('subscription')
            user_id = data.get('metadata', {}).get('user_id')
            plan_id = data.get('metadata', {}).get('plan_id')

            if stripe_sub_id and user_id and plan_id:
                try:
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    user = User.objects.get(pk=user_id)
                    plan = Plan.objects.get(pk=plan_id)

                    # Retrieve the Stripe subscription for period end
                    stripe_sub = stripe.Subscription.retrieve(stripe_sub_id)
                    period_end = datetime.fromtimestamp(
                        stripe_sub['current_period_end'], tz=dt_timezone.utc
                    )

                    Subscription.objects.update_or_create(
                        user=user,
                        defaults={
                            'plan': plan,
                            'stripe_subscription_id': stripe_sub_id,
                            'stripe_customer_id': data.get('customer', ''),
                            'status': 'active',
                            'current_period_end': period_end,
                            'cancel_at_period_end': False,
                        }
                    )
                except Exception as e:
                    return HttpResponse(f'Subscription activation error: {e}', status=500)

        # ── invoice.payment_succeeded ─────────────────────────────────────
        elif event_type == 'invoice.payment_succeeded':
            stripe_sub_id = data.get('subscription')
            period_end_ts = data.get('lines', {}).get('data', [{}])[0].get('period', {}).get('end')

            if stripe_sub_id:
                qs = Subscription.objects.filter(stripe_subscription_id=stripe_sub_id)
                if qs.exists():
                    update = {'status': 'active'}
                    if period_end_ts:
                        update['current_period_end'] = datetime.fromtimestamp(
                            period_end_ts, tz=dt_timezone.utc
                        )
                    qs.update(**update)

        # ── customer.subscription.deleted ─────────────────────────────────
        elif event_type == 'customer.subscription.deleted':
            stripe_sub_id = data.get('id')
            if stripe_sub_id:
                Subscription.objects.filter(
                    stripe_subscription_id=stripe_sub_id
                ).update(status='canceled', cancel_at_period_end=False)

        return HttpResponse(status=200)
