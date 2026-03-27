from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class StoreCustomization(models.Model):
    tenant = models.OneToOneField('tenants.Tenant', on_delete=models.CASCADE, related_name='store_customization', null=True, blank=True)
    active_theme = models.CharField(max_length=50, default='default')
    logo_url = models.URLField(blank=True)
    layout_json = models.JSONField(default=dict, blank=True)
    navigation_json = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Store Customization ({self.tenant})"

class Category(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    TYPE_CHOICES = [
        ('digital', 'Digital Download'),
        ('physical', 'Physical Hardware'),
        ('subscription', 'Subscription/Service'),
        ('service_bundle', 'Service Bundle'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    description = models.TextField(blank=True)
    product_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='digital')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sku = models.CharField(max_length=100, blank=True, null=True)
    stripe_price_id = models.CharField(max_length=100, blank=True, help_text="Stripe Price ID for Checkout")
    file = models.FileField(upload_to='products/', null=True, blank=True)
    features = models.JSONField(default=list, blank=True, help_text="List of features")
    stock_quantity = models.IntegerField(default=0, help_text="Available stock")
    track_stock = models.BooleanField(default=False, help_text="Auto-decrement stock on sale?")
    is_active = models.BooleanField(default=True) # Deprecated in favor of status
    
    # Advanced Commerce
    categories = models.ManyToManyField(Category, blank=True, related_name='products')
    components = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='bundles')
    
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_bundle(self):
        return self.product_type == 'service_bundle'

    def __str__(self):
        return self.name

class LicenseKey(models.Model):
    """
    License keys for digital software products.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='licenses')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='licenses', null=True, blank=True)
    key = models.CharField(max_length=200, unique=True)
    is_used = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='licenses')
    assigned_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.key

class CustomerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='store_customer_profile')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='customers', null=True, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='active')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Customer: {self.user.username}"

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='store_orders')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='store_orders', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, default='pending')
    payment_status = models.CharField(max_length=50, default='pending')
    fulfillment_status = models.CharField(max_length=50, default='unfulfilled')
    payment_intent_id = models.CharField(max_length=100, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id}"

class OrderTimeline(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='timeline')
    state = models.CharField(max_length=50)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ShippingSetting(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='shipping_settings', null=True, blank=True)
    zone_name = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_methods = models.JSONField(default=list, blank=True)
    tracking_integration = models.JSONField(default=dict, blank=True)

class LandingPage(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='landing_pages', null=True, blank=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    campaign_slug = models.CharField(max_length=100, blank=True)
    builder_json = models.JSONField(default=dict, blank=True)
    seo_metadata = models.JSONField(default=dict, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class TrackingConfig(models.Model):
    tenant = models.OneToOneField('tenants.Tenant', on_delete=models.CASCADE, related_name='tracking_config', null=True, blank=True)
    facebook_pixel_id = models.CharField(max_length=100, blank=True)
    google_analytics_id = models.CharField(max_length=100, blank=True)
    conversion_mapping = models.JSONField(default=dict, blank=True)

class AddOn(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='addons', null=True, blank=True)
    name = models.CharField(max_length=100)
    provider = models.CharField(max_length=100)
    is_enabled = models.BooleanField(default=False)
    config_json = models.JSONField(default=dict, blank=True)

class SubscriptionPlan(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='subscription_plans', null=True, blank=True)
    name = models.CharField(max_length=100)
    billing_cycle = models.CharField(max_length=50, choices=[('monthly', 'Monthly'), ('yearly', 'Yearly')])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

class Subscription(models.Model):
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.RESTRICT)
    status = models.CharField(max_length=50, default='active')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    next_renewal_date = models.DateTimeField(null=True, blank=True)

class StoreSetting(models.Model):
    tenant = models.OneToOneField('tenants.Tenant', on_delete=models.CASCADE, related_name='store_settings', null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    email_templates = models.JSONField(default=dict, blank=True)
    policies = models.JSONField(default=dict, blank=True)
    api_keys = models.JSONField(default=dict, blank=True)
