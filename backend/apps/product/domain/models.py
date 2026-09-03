from apps.core.validators import validate_document_file, validate_image_file
from django.db import models
from django.conf import settings
from apps.core.models import TenantAwareModel


class ProductTag(TenantAwareModel):
    """Product tags for classification and filtering."""
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, default='blue', help_text='Color identifier for UI display')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Category(TenantAwareModel):
    """Product category with hierarchy support."""
    website = models.ForeignKey(
        'website.Website', on_delete=models.CASCADE, null=True, blank=True,
        related_name='store_categories'
    )
    parent_category = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='subcategories'
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True, validators=[validate_image_file])
    is_visible = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name_plural = 'categories'

    @property
    def complete_name(self):
        if self.parent_category:
            return f'{self.parent_category.complete_name} / {self.name}'
        return self.name

    def __str__(self):
        return self.complete_name


class Product(TenantAwareModel):
    """Core product/service master record (Odoo product.template equivalent)."""
    TYPE_CHOICES = [
        ('digital', 'Digital Download'),
        ('physical', 'Physical Hardware'),
        ('subscription', 'Subscription/Service'),
        ('service_bundle', 'Service Bundle'),
        ('service', 'Professional Service'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]
    TRACKING_CHOICES = [
        ('none', 'No Tracking'),
        ('lot', 'By Lots'),
        ('serial', 'By Unique Serial Number'),
    ]
    DELIVERY_CHOICES = [
        ('instant', 'Instant Download'),
        ('email', 'Email Delivery'),
        ('shipping', 'Physical Shipping'),
    ]

    # Core identification
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    internal_reference = models.CharField(max_length=100, blank=True, help_text='Internal reference / SKU')
    barcode = models.CharField(max_length=100, blank=True, null=True, help_text='Barcode (EAN, UPC, etc.)')
    sku = models.CharField(max_length=100, blank=True, null=True)  # Legacy, use internal_reference

    # Relations
    website = models.ForeignKey(
        'website.Website', on_delete=models.CASCADE, null=True, blank=True,
        related_name='store_products'
    )
    responsible = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='responsible_products', help_text='Person responsible for this product'
    )
    tags = models.ManyToManyField(ProductTag, blank=True, related_name='products')
    categories = models.ManyToManyField(Category, blank=True, related_name='products')
    components = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='bundles')

    # Description
    description = models.TextField(blank=True)
    description_purchase = models.TextField(blank=True, help_text='Description shown on purchase orders')
    description_sale = models.TextField(blank=True, help_text='Description shown on sale orders / invoices')

    # Type & Status
    product_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='digital')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    # Flags (Odoo parity)
    sales_ok = models.BooleanField(default=True, help_text='Can be sold')
    purchase_ok = models.BooleanField(default=True, help_text='Can be purchased')
    is_featured = models.BooleanField(default=False)
    can_be_expensed = models.BooleanField(default=False)

    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stripe_price_id = models.CharField(max_length=100, blank=True, help_text='Stripe Price ID for Checkout')

    # Media
    file = models.FileField(upload_to='products/', null=True, blank=True, validators=[validate_document_file])
    image = models.ImageField(upload_to='products/images/', null=True, blank=True, validators=[validate_image_file])

    # Physical attributes
    brand = models.CharField(max_length=100, blank=True, help_text='Hardware or software vendor')
    vendor = models.CharField(max_length=100, blank=True, help_text='Distributor')
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dimensions = models.CharField(max_length=100, blank=True, help_text='L x W x H for shipping')
    warranty_months = models.IntegerField(default=12)
    tracking = models.CharField(max_length=20, choices=TRACKING_CHOICES, default='none', help_text='Lot/serial tracking method')

    # Licensing & delivery
    license_type = models.CharField(max_length=50, blank=True, help_text='Perpetual, Subscription, Trial, OEM')
    delivery_type = models.CharField(max_length=50, choices=DELIVERY_CHOICES, default='instant')

    # Quantities
    min_quantity = models.IntegerField(default=1, help_text='Minimum B2B order quantity')
    max_quantity = models.IntegerField(null=True, blank=True)
    sort_order = models.IntegerField(default=0)

    # Specs & features
    specifications = models.JSONField(default=dict, blank=True)
    features = models.JSONField(default=list, blank=True)

    # Stock
    stock_quantity = models.IntegerField(default=0)
    track_stock = models.BooleanField(default=False)

    # Rental
    is_rental = models.BooleanField(default=False)
    rental_pricing = models.JSONField(default=dict, blank=True, help_text="e.g. {'daily': 50, 'weekly': 200}")

    # Accounting integration
    unit_label = models.CharField(max_length=50, default='unit', help_text='e.g. hour, month, unit, license')
    tax_config = models.ForeignKey(
        'accounting.TaxConfig', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='store_products'
    )
    income_account = models.ForeignKey(
        'accounting.Account', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='store_income_products'
    )
    expense_account = models.ForeignKey(
        'accounting.Account', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='store_expense_products'
    )

    class Meta:
        ordering = ['sort_order', 'name']

    @property
    def is_bundle(self):
        return self.product_type == 'service_bundle'

    def __str__(self):
        return self.name


class ProductAttribute(TenantAwareModel):
    """Configurable attribute (e.g. Color, Size)."""
    name = models.CharField(max_length=100, help_text='e.g. Color, Size, Material')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class ProductAttributeValue(TenantAwareModel):
    """A specific value for an attribute (e.g. Red, XL)."""
    attribute = models.ForeignKey(ProductAttribute, on_delete=models.CASCADE, related_name='values')
    value = models.CharField(max_length=100, help_text='e.g. Red, XL, Cotton')
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'value']

    def __str__(self):
        return f'{self.attribute.name}: {self.value}'


class ProductVariant(TenantAwareModel):
    """A specific variant combination (e.g. Blue / XL)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    attribute_values = models.ManyToManyField(ProductAttributeValue, related_name='variants')
    sku = models.CharField(max_length=100, blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    price_extra = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_quantity = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/variants/', null=True, blank=True, validators=[validate_image_file])
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['product', 'id']

    def __str__(self):
        variant_name = ' - '.join([v.value for v in self.attribute_values.all()])
        return f'{self.product.name} ({variant_name})' if variant_name else self.product.name


class ProductReview(TenantAwareModel):
    """Customer review for a product."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='product_reviews'
    )
    rating = models.PositiveIntegerField(default=5, help_text='Rating from 1 to 5')
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField(blank=True)
    is_approved = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Review for {self.product.name} ({self.rating}/5)'
