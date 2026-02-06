from django.db import models
from django.conf import settings
from django.utils import timezone

class Product(models.Model):
    TYPE_CHOICES = [
        ('digital', 'Digital Download'),
        ('physical', 'Physical Hardware'),
        ('subscription', 'Subscription/Service'),
        ('service_bundle', 'Service Bundle'),
    ]
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    description = models.TextField(blank=True)
    product_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='digital')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_price_id = models.CharField(max_length=100, blank=True, help_text="Stripe Price ID for Checkout")
    file = models.FileField(upload_to='products/', null=True, blank=True)
    features = models.JSONField(default=list, blank=True, help_text="List of features")
    stock_quantity = models.IntegerField(default=0, help_text="Available stock")
    track_stock = models.BooleanField(default=False, help_text="Auto-decrement stock on sale?")
    is_active = models.BooleanField(default=True)
    
    # Advanced Commerce
    components = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='bundles')
    service = models.ForeignKey('erp.Service', on_delete=models.SET_NULL, null=True, blank=True, related_name='store_products', help_text="Link to ERP Service for provisioning")
    
    @property
    def is_bundle(self):
        return self.product_type == 'service_bundle'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Plan(models.Model):
    """
    Platform Subscription Plans (e.g., Essential, Pro, Enterprise)
    Controls access to dashboard modules.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_price_id_monthly = models.CharField(max_length=100)
    stripe_price_id_yearly = models.CharField(max_length=100)
    included_modules = models.JSONField(default=list, help_text="Modules: endpoint, cloud, email, alerts, reports")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    """
    User's active subscription to the platform.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('trial', 'Free Trial'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('incomplete', 'Incomplete'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name='subscriptions')
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='incomplete')
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({self.status})"

    @property
    def is_valid(self):
        return self.status in ['active', 'trial', 'past_due'] and (self.current_period_end is None or self.current_period_end > timezone.now())


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


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True) # Optional for pure plan handling?
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    # Actually, keep it simple for now, generic order
    status = models.CharField(max_length=50, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=50, blank=True)
    stripe_session = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order #{self.id} - {self.user}'


class StoreSettings(models.Model):
    """
    Global settings for the store module.
    Singleton pattern usage expected (only one instance).
    """
    tenant = models.OneToOneField('tenants.Tenant', on_delete=models.CASCADE, related_name='store_settings', null=True, blank=True)
    store_name = models.CharField(max_length=200, default="BitGuard Official Store")
    currency = models.CharField(max_length=10, default="USD", choices=[
        ('USD', 'USD ($)'),
        ('EUR', 'EUR (€)'),
        ('GBP', 'GBP (£)'),
        ('DZD', 'DZD (DA)'),
    ])
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    email_notifications = models.BooleanField(default=True)
    auto_process_orders = models.BooleanField(default=False)
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Store Settings ({self.currency})"

    class Meta:
        verbose_name_plural = "Store Settings"
