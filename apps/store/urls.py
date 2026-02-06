from django.urls import path
from . import views, webhook
urlpatterns = [
    path('', views.products_page, name='products_page'),
    path('plans/', views.plans_page, name='plans_page'),
    path('product/<slug:slug>/', views.product_detail_page, name='product_detail_page'),
    # Checkout routes:
    path('checkout/product/<int:type_id>/', views.checkout_redirect, {'type_model': 'product'}, name='checkout_product'),
    path('checkout/plan/<int:type_id>/', views.checkout_redirect, {'type_model': 'plan'}, name='checkout_plan'),
    
    path('my-subscriptions/', views.my_subscriptions, name='my_subscriptions'),
    path('order_confirmation/', views.order_confirmation, name='order_confirmation'),
    path('download/<int:order_id>/', views.secure_download, name='secure_download'),
    path('webhook/stripe/', webhook.stripe_webhook, name='stripe_webhook'),
]
