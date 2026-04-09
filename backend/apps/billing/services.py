import stripe
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from .models import Invoice, Plan, Subscription
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
    Handles financial records and invoices within the billing context.
    """
    @classmethod
    @transaction.atomic
    def create_invoice(cls, user, amount, payment_method='stripe', stripe_invoice_id=None, request=None, due_date=None, notes=""):
        """
        Transactional invoice creation with Charter compliance.
        """
        tenant = cls.get_tenant_context(request)
        import uuid
        invoice_num = f"INV-{str(uuid.uuid4())[:8].upper()}"
        
        invoice = Invoice.objects.create(
            user=user,
            invoice_number=invoice_num,
            amount=amount,
            payment_method=payment_method,
            stripe_invoice_id=stripe_invoice_id if stripe_invoice_id else "",
            tenant=tenant,
            status='pending',
            due_date=due_date
        )
        
        if request:
            AuditService.log_action(
                request,
                action="BILLING_INVOICE_CREATED",
                resource=f"billing.Invoice:{invoice.id}",
                payload={"amount": float(amount), "invoice_number": invoice_num}
            )
            
        return invoice

    @classmethod
    @transaction.atomic
    def create_invoice_from_quote(cls, request, quote_id: str) -> Invoice:
        """
        Cross-module integration: Generates a billing Invoice when a CRM/Contract Quote is accepted.
        """
        from apps.contracts.models import Quote
        tenant = cls.get_tenant_context(request)
        
        quote = Quote.objects.get(id=quote_id)
        
        # Security: ensure cross-tenant data safety
        if tenant and quote.tenant and quote.tenant != tenant:
            raise ValueError("Cross-tenant violation: Quote does not belong to active tenant.")
            
        if quote.status != 'accepted':
            raise ValueError("Invoice can only be generated from an accepted quote.")
            
        # Optional: verify an invoice doesn't already exist for this quote, 
        # but right now we don't have a direct link on Invoice. We can just create it.
        
        # Calculate amount from quote
        amount = quote.total
        
        # Use the client's associated user if available, or request user
        user = None
        if quote.client and quote.client.assigned_to:
             user = quote.client.assigned_to
        if not user:
             user = request.user
             
        import datetime
        due_date = timezone.now() + datetime.timedelta(days=30)
        
        invoice = cls.create_invoice(
            user=user,
            amount=amount,
            request=request,
            due_date=due_date,
            notes=f"Generated from Quote {quote.id}"
        )
        
        AuditService.log_action(
            request,
            action="BILLING_QUOTE_TO_INVOICE",
            resource=f"billing.Invoice:{invoice.id}",
            payload={"quote_id": str(quote.id), "amount": float(amount)}
        )
        return invoice

    @staticmethod
    def get_invoice_revenue(user=None):
        from django.db.models import Sum
        queryset = Invoice.objects.filter(status='paid')
        if user:
            queryset = queryset.filter(user=user)
        return queryset.aggregate(total=Sum('amount'))['total'] or 0
