from django.shortcuts import render, get_object_or_404, redirect
from django.conf import settings
from django.contrib.auth.decorators import login_required
from .models import Product, Order, Plan, Subscription
import stripe, os

stripe.api_key = settings.STRIPE_SECRET_KEY

def products_page(request):
    products = Product.objects.filter(is_active=True, product_type__in=['digital', 'physical'])
    return render(request, 'store/products.html', {'products': products})

def plans_page(request):
    """
    Pricing page for Unified Cyber Security Platform plans.
    """
    plans = Plan.objects.filter(is_active=True).order_by('price_monthly')
    return render(request, 'store/plans.html', {'plans': plans})

def product_detail_page(request, slug):
    product = get_object_or_404(Product, slug=slug)
    return render(request, 'store/product_detail.html', {'product': product})

@login_required(login_url='/login/')
def checkout_redirect(request, type_id, type_model):
    """
    Handles checkout for both Products and Plans.
    type_model: 'product' or 'plan'
    """
    success = request.build_absolute_uri('/store/order_confirmation/')
    
    if type_model == 'plan':
        plan = get_object_or_404(Plan, id=type_id)
        cancel = request.build_absolute_uri('/store/plans/')
        
        # Check if user already has active sub
        if hasattr(request.user, 'subscription') and request.user.subscription.is_valid:
             # Logic for upgrade/downgrade could go here (Stripe Portal better)
             pass

        # Create Checkout Session for Subscription
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': plan.stripe_price_id_monthly, # Defaulting to monthly for MVP
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=cancel,
            customer_email=request.user.email,
            metadata={'type': 'plan', 'plan_id': plan.id, 'user_id': request.user.id}
        )
        
    else: # Product
        product = get_object_or_404(Product, id=type_id)
        cancel = request.build_absolute_uri(f'/store/product/{product.slug}/')
        
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
            success_url=success + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=cancel,
            customer_email=request.user.email,
            metadata={'type': 'product', 'product_id': product.id, 'user_id': request.user.id}
        )
        # Create pending order
        Order.objects.create(user=request.user, product=product, status='pending', stripe_session=session.id, payment_method='stripe')

    return redirect(session.url)


@login_required(login_url='/login/')
def my_subscriptions(request):
    """
    User dashboard for managing subscriptions.
    """
    sub = getattr(request.user, 'subscription', None)
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    
    context = {
        'subscription': sub,
        'orders': orders
    }
    return render(request, 'store/my_subscriptions.html', context)

def order_confirmation(request):
    return render(request, 'store/order_confirmation.html')

from django.http import FileResponse, Http404

@login_required
def secure_download(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    if not order.product.file:
        raise Http404('No file')
    path = order.product.file.path
    return FileResponse(open(path, 'rb'), as_attachment=True, filename=os.path.basename(path))
