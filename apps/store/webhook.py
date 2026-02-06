import stripe, json
from django.utils import timezone
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Order
stripe.api_key = settings.STRIPE_SECRET_KEY
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    try:
        event = json.loads(payload)
    except Exception:
        return HttpResponse(status=400)
    # HANDLE ONE-TIME PAYMENTS
    if event.get('type') == 'checkout.session.completed':
        session = event.get('data', {}).get('object', {})
        metadata = session.get('metadata', {})
        
        # If it was a generic product order
        if metadata.get('type') == 'product':
            try:
                order = Order.objects.filter(stripe_session=session.get('id')).first()
                if order:
                    order.status = 'paid'
                    order.save()
                    # Assign License Key if digital
                    if order.product.product_type == 'digital':
                        from .models import LicenseKey
                        key = LicenseKey.objects.filter(product=order.product, is_used=False).first()
                        if key:
                            key.is_used = True
                            key.user = order.user
                            key.assigned_at = timezone.now()
                            key.save()
            except Exception:
                pass

        # If it was a subscription
        elif metadata.get('type') == 'plan':
            from .models import Subscription, Plan
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            user_id = metadata.get('user_id')
            plan_id = metadata.get('plan_id')
            stripe_sub_id = session.get('subscription')
            stripe_cus_id = session.get('customer')
            
            user = User.objects.get(id=user_id)
            plan = Plan.objects.get(id=plan_id)
            
            # Create or Update Subscription
            Subscription.objects.update_or_create(
                user=user,
                defaults={
                    'plan': plan,
                    'stripe_subscription_id': stripe_sub_id,
                    'stripe_customer_id': stripe_cus_id,
                    'status': 'active'
                }
            )

    # HANDLE SUBSCRIPTION LIFECYCLE
    elif event.get('type') in ['customer.subscription.updated', 'customer.subscription.deleted']:
        sub_data = event.get('data', {}).get('object', {})
        stripe_sub_id = sub_data.get('id')
        status = sub_data.get('status')
        
        from .models import Subscription
        try:
            sub = Subscription.objects.get(stripe_subscription_id=stripe_sub_id)
            sub.status = status
            sub.save()
        except Subscription.DoesNotExist:
            pass
            
    return HttpResponse(status=200)
