from apps.core.validators import validate_document_file, validate_image_file
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.core.models import TenantAwareModel

class StoreCustomization(TenantAwareModel):
    active_theme = models.CharField(max_length=50, default='default')
    logo_url = models.URLField(blank=True)
    layout_json = models.JSONField(default=dict, blank=True)
    navigation_json = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Store Customization ({self.tenant})"


class LicenseKey(TenantAwareModel):
    """
    License keys for digital software products.
    """
    product = models.ForeignKey('product.Product', on_delete=models.CASCADE, related_name='licenses')
    key = models.CharField(max_length=200, unique=True)
    is_used = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='licenses')
    assigned_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.key

class CustomerProfile(TenantAwareModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='store_customer_profile')
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='active')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Customer: {self.user.username}"

class Order(TenantAwareModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='store_orders')
    website = models.ForeignKey('website.Website', on_delete=models.CASCADE, null=True, blank=True, related_name='store_orders_website')
    product = models.ForeignKey('product.Product', on_delete=models.SET_NULL, null=True, blank=True)
    variant = models.ForeignKey('product.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True) # Legacy 1:1 format, keeping for backwards compatibility
    invoice = models.ForeignKey('accounting.Invoice', on_delete=models.SET_NULL, null=True, blank=True, related_name='store_orders')
    status = models.CharField(max_length=50, default='pending')
    payment_status = models.CharField(max_length=50, default='pending')
    fulfillment_status = models.CharField(max_length=50, default='unfulfilled')
    payment_intent_id = models.CharField(max_length=100, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Order #{self.id}"

class OrderItem(TenantAwareModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('product.Product', on_delete=models.SET_NULL, null=True, blank=True)
    variant = models.ForeignKey('product.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    options = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.product.name if self.product else 'Deleted Product'} (Order #{self.order.id})"

class OrderTimeline(TenantAwareModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='timeline')
    state = models.CharField(max_length=50)
    note = models.TextField(blank=True)

class ShippingSetting(TenantAwareModel):
    zone_name = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_methods = models.JSONField(default=list, blank=True)
    tracking_integration = models.JSONField(default=dict, blank=True)



class TrackingConfig(TenantAwareModel):
    facebook_pixel_id = models.CharField(max_length=100, blank=True)
    google_analytics_id = models.CharField(max_length=100, blank=True)
    conversion_mapping = models.JSONField(default=dict, blank=True)

class AddOn(TenantAwareModel):
    name = models.CharField(max_length=100)
    provider = models.CharField(max_length=100)
    is_enabled = models.BooleanField(default=False)
    config_json = models.JSONField(default=dict, blank=True)

class SubscriptionPlan(TenantAwareModel):
    name = models.CharField(max_length=100)
    billing_cycle = models.CharField(max_length=50, choices=[('monthly', 'Monthly'), ('yearly', 'Yearly')], null=True, blank=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    trial_days = models.IntegerField(default=0)
    features = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

class Subscription(TenantAwareModel):
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.RESTRICT)
    status = models.CharField(max_length=50, default='active')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    next_renewal_date = models.DateTimeField(null=True, blank=True)

class StoreSetting(TenantAwareModel):
    currency = models.CharField(max_length=10, default='USD')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    email_templates = models.JSONField(default=dict, blank=True)
    policies = models.JSONField(default=dict, blank=True)
    api_keys = models.JSONField(default=dict, blank=True)

class PartnerRequest(TenantAwareModel):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    interest_areas = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.company_name} ({self.status})"

class Coupon(TenantAwareModel):
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=[('percentage', 'Percentage'), ('fixed', 'Fixed Amount')])
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField(null=True, blank=True)
    valid_to = models.DateTimeField(null=True, blank=True)
    usage_limit = models.IntegerField(null=True, blank=True)
    times_used = models.IntegerField(default=0)
    
    def __str__(self):
        return self.code

class Cart(TenantAwareModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='carts')
    session_id = models.CharField(max_length=255, null=True, blank=True)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Cart {self.pk} (User: {self.user})"

class CartItem(TenantAwareModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('product.Product', on_delete=models.CASCADE)
    variant = models.ForeignKey('product.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"


class PaymentProvider(TenantAwareModel):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    provider_type = models.CharField(max_length=50, choices=[('stripe', 'Stripe'), ('paypal', 'PayPal'), ('wire', 'Wire Transfer')])
    website = models.ForeignKey('website.Website', on_delete=models.CASCADE, null=True, blank=True)


