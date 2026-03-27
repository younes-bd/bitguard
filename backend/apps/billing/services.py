import stripe
from django.conf import settings
from .models import Order, Plan, Subscription
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService

stripe.api_key = settings.STRIPE_SECRET_KEY

class SubscriptionService(BaseService):
    """
    Handles recurring billing and platform subscriptions.
    Charter Compliance: Enforces tenant context and logs the action.
    """
    
    @classmethod
    def create_subscription_session(cls, user, plan, success_url, cancel_url, request=None):
        """
        Creates a Stripe Checkout Session for a recurring subscription plan.
        """
        tenant = cls.get_tenant_context(request)
        
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
                'user_id': user.id,
                'tenant_id': tenant.id if tenant else None
            }
        )
        
        # Log Action
        if request:
            AuditService.log_action(
                request, 
                action="SUBSCRIPTION_CHECKOUT_INITIATED", 
                resource=f"billing.Plan:{plan.id}",
                payload={"stripe_session": session.id, "tenant": tenant.id if tenant else "global"}
            )
            
        return session.url

    @staticmethod
    def get_subscription_stats():
        from django.db.models import Sum
        subscriptions = Subscription.objects.all().select_related('plan')
        # Simple MRR calculation
        total_mrr = sum([s.plan.price_monthly for s in subscriptions if s.is_valid and s.plan])
        return {
            "mrr": float(total_mrr),
            "count": subscriptions.count()
        }

class BillingService(BaseService):
    """
    Handles financial records and orders within the billing context.
    """
    @classmethod
    def create_order(cls, user, product_id, product_name, amount, payment_method='stripe', stripe_session=None, request=None):
        """
        Transactional order creation with Charter compliance (Section 8, 18).
        """
        tenant = cls.get_tenant_context(request)
        
        order = Order.objects.create(
            user=user,
            product_id=product_id,
            product_name=product_name,
            amount=amount,
            payment_method=payment_method,
            stripe_session=stripe_session,
            tenant=tenant,
            status='pending'
        )
        
        if request:
            AuditService.log_action(
                request,
                action="BILLING_ORDER_CREATED",
                resource=f"billing.Order:{order.id}",
                payload={"amount": float(amount), "product": product_name}
            )
            
        return order

    @staticmethod
    def get_order_revenue(user=None):
        from django.db.models import Sum
        queryset = Order.objects.all()
        if user:
            queryset = queryset.filter(user=user)
        return queryset.aggregate(total=Sum('amount'))['total'] or 0
