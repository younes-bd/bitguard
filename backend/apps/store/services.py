import stripe
from django.conf import settings
from django.utils import timezone
from .models import (
    StoreCustomization, Category, Product, CustomerProfile, Order, OrderTimeline,
    ShippingSetting, LandingPage, TrackingConfig, AddOn, SubscriptionPlan, Subscription, StoreSetting
)
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService

stripe.api_key = settings.STRIPE_SECRET_KEY

class CommerceService(BaseService):
    """
    Handles complete Store Engine operations inside the Enterprise.
    Enforces cross-module integration (Orders -> CRM, Sales -> ERP, etc.)
    """

    @classmethod
    def get_customization(cls, request):
        tenant = cls.get_tenant_context(request)
        cust, created = StoreCustomization.objects.get_or_create(tenant=tenant)
        return cust

    @classmethod
    def update_customization(cls, data, request):
        cust = cls.get_customization(request)
        for field, value in data.items():
            setattr(cust, field, value)
        cust.save()
        AuditService.log_action(request, action="STORE_CUSTOMIZATION_UPDATED", resource=f"store.StoreCustomization:{cust.pk}", payload=data)
        return cust

    # Categories
    @classmethod
    def list_categories(cls, request):
        tenant = cls.get_tenant_context(request)
        return Category.objects.filter(tenant=tenant)

    @classmethod
    def create_category(cls, data, request):
        data['tenant'] = cls.get_tenant_context(request)
        category = Category.objects.create(**data)
        AuditService.log_action(request, action="STORE_CATEGORY_CREATED", resource=f"store.Category:{category.pk}", payload=data)
        return category

    # Products
    @classmethod
    def list_products(cls, request):
        tenant = cls.get_tenant_context(request)
        return Product.objects.filter(tenant=tenant)

    @classmethod
    def create_product(cls, data, request):
        categories_data = data.pop('categories', [])
        data['tenant'] = cls.get_tenant_context(request)
        product = Product.objects.create(**data)
        if categories_data:
            product.categories.set(categories_data)
        AuditService.log_action(request, action="STORE_PRODUCT_CREATED", resource=f"store.Product:{product.pk}", payload=data)
        return product

    # Orders & Enterprise Integration Rules
    @classmethod
    def list_orders(cls, request):
        tenant = cls.get_tenant_context(request)
        return Order.objects.filter(tenant=tenant).order_by('-created_at')

    @classmethod
    def create_order(cls, data, request):
        """
        Creates an order and triggers cross-module operational obligations.
        """
        data['tenant'] = cls.get_tenant_context(request)
        user = data.get('user')
        if not user:
            user = request.user
            data['user'] = user

        order = Order.objects.create(**data)
        OrderTimeline.objects.create(order=order, state="created", note="Order created via API")
        
        # Enterprise Integration: Create CRM Customer Log
        CustomerProfile.objects.get_or_create(user=user, tenant=data['tenant'])
        
        # Log Audit
        AuditService.log_action(request, action="STORE_ORDER_CREATED", resource=f"store.Order:{order.pk}", payload={"total_amount": float(order.total_amount)})

        # Cross-module workflow: If order has an ERP service linked, create obligation
        if order.product and order.product.service:
            try:
                from apps.erp.services import EnterpriseService
                EnterpriseService.create_delivery_obligation(order, request)
            except ImportError:
                pass # Gracefull degradation if ERP module doesn't expose this yet

        return order

    @classmethod
    def update_order_status(cls, order, new_status, request):
        order.status = new_status
        order.save()
        OrderTimeline.objects.create(order=order, state=new_status, note=f"Status updated to {new_status}")
        
        # Enterprise Integration: If completed/paid, create accounting events
        if new_status == 'paid':
            try:
                from apps.erp.services import EnterpriseService
                EnterpriseService.create_invoice({
                    "tenant": order.tenant,
                    "title": f"Invoice for Order #{order.id}",
                    "amount": order.total_amount,
                    "status": "paid",
                    "issue_date": timezone.now().date(),
                    "due_date": timezone.now().date(),
                }, request)
            except Exception:
                pass # Soft failure for workflow if ERP invoice fails

        AuditService.log_action(request, action="STORE_ORDER_STATUS_UPDATED", resource=f"store.Order:{order.pk}", payload={"status": new_status})
        return order


    # Subscriptions
    @classmethod
    def list_subscriptions(cls, request):
        tenant = cls.get_tenant_context(request)
        return Subscription.objects.filter(customer__tenant=tenant)

    @classmethod
    def create_subscription(cls, data, request):
        """
        Activates recurring billing cycle.
        """
        sub = Subscription.objects.create(**data)
        AuditService.log_action(request, action="STORE_SUBSCRIPTION_CREATED", resource=f"store.Subscription:{sub.pk}", payload={"plan": sub.plan.name})
        return sub

    # Settings and tracking
    @classmethod
    def get_store_settings(cls, request):
        tenant = cls.get_tenant_context(request)
        settings_obj, created = StoreSetting.objects.get_or_create(tenant=tenant)
        return settings_obj

    @classmethod
    def list_shipping_settings(cls, request):
        tenant = cls.get_tenant_context(request)
        return ShippingSetting.objects.filter(tenant=tenant)

    @classmethod
    def list_landing_pages(cls, request):
        tenant = cls.get_tenant_context(request)
        return LandingPage.objects.filter(tenant=tenant)

    @classmethod
    def list_addons(cls, request):
        tenant = cls.get_tenant_context(request)
        return AddOn.objects.filter(tenant=tenant)

    @classmethod
    def get_tracking_config(cls, request):
        tenant = cls.get_tenant_context(request)
        tc, created = TrackingConfig.objects.get_or_create(tenant=tenant)
        return tc

    # Original Checkout Method (modified slightly)
    @classmethod
    def create_checkout_session(cls, user, product, success_url, cancel_url, request=None):
        tenant = cls.get_tenant_context(request)
        
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
                'user_id': user.id,
                'tenant_id': tenant.id if tenant else None
            }
        )
        # Create an order locally
        cls.create_order({
            "user": user,
            "product": product,
            "total_amount": product.price,
            "payment_intent_id": session.id,
            "status": "pending_payment"
        }, request)
            
        return session.url

    @staticmethod
    def get_order_revenue(user=None):
        from django.db.models import Sum
        queryset = Order.objects.all()
        if user:
            queryset = queryset.filter(user=user)
        return queryset.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    @staticmethod
    def get_subscription_stats():
        from django.db.models import Sum
        mrr = SubscriptionPlan.objects.aggregate(Sum('price'))['price__sum'] or 0
        return {"mrr": float(mrr)}
