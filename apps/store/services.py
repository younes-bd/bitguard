import stripe
from django.conf import settings
from .models import Order, Product, Plan, Subscription
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService

stripe.api_key = settings.STRIPE_SECRET_KEY

class CommerceService(BaseService):
    @staticmethod
    def create_checkout_session(user, product, success_url, cancel_url, request=None):
        """
        Creates a Stripe Checkout Session for a one-time product purchase.
        """
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': product.name},
                    'unit_amount': int(product.price * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=cancel_url,
            customer_email=user.email,
            metadata={
                'type': 'product',
                'product_id': product.id,
                'user_id': user.id
            }
        )
        
        # Create pending order - ensuring transactionality and traceability
        order = Order.objects.create(
            user=user, 
            product=product, 
            status='pending', 
            stripe_session=session.id, 
            payment_method='stripe'
        )
        
        # Log Action
        if request:
            AuditService.log(
                request, 
                action="PRODUCT_CHECKOUT_INITIATED", 
                resource=f"store.Product:{product.id}",
                payload={"order_id": order.id, "stripe_session": session.id}
            )
            
        return session.url

    @staticmethod
    def get_order_revenue(user=None):
        from django.db.models import Sum
        queryset = Order.objects.all()
        if user:
            queryset = queryset.filter(user=user)
        return queryset.aggregate(Sum('amount'))['amount__sum'] or 0

    @staticmethod
    def get_subscription_stats():
        from django.db.models import Sum
        subscriptions = Subscription.objects.all().select_related('plan')
        # Simple MRR calculation
        total_mrr = sum([s.plan.price_monthly for s in subscriptions if s.is_valid and s.plan])
        return {
            "mrr": total_mrr,
            "count": subscriptions.count()
        }

class SubscriptionService(BaseService):
    @staticmethod
    def create_subscription_session(user, plan, success_url, cancel_url, request=None):
        """
        Creates a Stripe Checkout Session for a recurring subscription plan.
        """
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': plan.stripe_price_id_monthly,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=cancel_url,
            customer_email=user.email,
            metadata={
                'type': 'plan',
                'plan_id': plan.id,
                'user_id': user.id
            }
        )
        
        # Log Action
        if request:
            AuditService.log(
                request, 
                action="SUBSCRIPTION_CHECKOUT_INITIATED", 
                resource=f"store.Plan:{plan.id}",
                payload={"stripe_session": session.id}
            )
            
        return session.url
