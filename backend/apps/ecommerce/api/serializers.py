from rest_framework import serializers

from ..domain.models import ProductAttribute, ProductAttributeValue, ProductVariant

class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['id', 'name']

class ProductAttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    class Meta:
        model = ProductAttributeValue
        fields = ['id', 'attribute', 'attribute_name', 'value']

class ProductVariantSerializer(serializers.ModelSerializer):
    attribute_values_details = ProductAttributeValueSerializer(source='attribute_values', many=True, read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'product_name', 'attribute_values', 'attribute_values_details', 'sku', 'price_extra', 'stock_quantity', 'image']

from ..domain.models import (
    StoreCustomization, Category, Product, LicenseKey, CustomerProfile,
    Order, OrderItem, OrderTimeline, ShippingSetting, TrackingConfig,
    AddOn, SubscriptionPlan, Subscription, StoreSetting, PartnerRequest,
    Cart, CartItem, Coupon
)

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'amount', 'is_active', 'valid_from', 'valid_to', 'usage_limit', 'times_used']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'website', 'parent_category', 'name', 'slug', 'description', 'image', 'is_visible']

class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='categories', many=True, write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = ['id', 'website', 'name', 'slug', 'description', 'product_type', 'status', 'price', 'discount_price', 'sku', 'file', 'image', 'brand', 'vendor', 'weight', 'dimensions', 'warranty_months', 'license_type', 'delivery_type', 'min_quantity', 'max_quantity', 'is_featured', 'sort_order', 'specifications', 'features', 'stock_quantity', 'track_stock', 'unit_label', 'categories', 'category_ids', 'created_at', 'updated_at', 'stripe_price_id', 'variants']
        extra_kwargs = {'stripe_price_id': {'write_only': True}}


class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    variant_details = ProductVariantSerializer(source='variant', read_only=True)
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'product_details', 'variant', 'variant_details', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    coupon_details = CouponSerializer(source='coupon', read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'session_id', 'coupon', 'coupon_details', 'items', 'created_at', 'updated_at']

class StoreCustomizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreCustomization
        fields = ['id', 'active_theme', 'logo_url', 'layout_json', 'navigation_json']



class LicenseKeySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = LicenseKey
        fields = ['id', 'product', 'product_name', 'key', 'is_used', 'user', 'assigned_at', 'expires_at']

class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = CustomerProfile
        fields = ['id', 'user', 'username', 'email', 'phone', 'address', 'status', 'notes', 'created_at', 'updated_at']

class OrderTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderTimeline
        fields = ['id', 'order', 'status', 'notes', 'created_at', 'created_by']

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    variant_details = ProductVariantSerializer(source='variant', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'product_details', 'variant', 'variant_details', 'quantity', 'unit_price', 'total_price', 'options']

class OrderSerializer(serializers.ModelSerializer):
    timeline = OrderTimelineSerializer(many=True, read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    product_details = ProductSerializer(source='product', read_only=True)
    customer_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'website', 'user', 'customer_name', 'product', 'product_details', 'status', 'payment_status', 'fulfillment_status', 'total_amount', 'created_at', 'updated_at', 'timeline', 'items', 'payment_intent_id']
        extra_kwargs = {'payment_intent_id': {'write_only': True}}

class ShippingSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingSetting
        fields = ['id', 'zone_name', 'rate', 'delivery_methods', 'tracking_integration']


class TrackingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingConfig
        fields = ['id', 'facebook_pixel_id', 'google_analytics_id', 'conversion_mapping']

class AddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = ['id', 'name', 'provider', 'is_enabled', 'config_json']

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'billing_cycle', 'price_monthly', 'price_yearly', 'trial_days', 'features', 'is_active']

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_details = SubscriptionPlanSerializer(source='plan', read_only=True)
    customer_details = CustomerProfileSerializer(source='customer', read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'customer', 'customer_details', 'plan', 'plan_details', 'status', 'start_date', 'end_date', 'next_renewal_date']

class StoreSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSetting
        fields = ['id', 'currency', 'tax_rate', 'email_templates', 'policies', 'api_keys']
        extra_kwargs = {'api_keys': {'write_only': True}}

class PartnerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerRequest
        fields = ['id', 'company_name', 'contact_person', 'email', 'interest_areas', 'notes', 'status', 'created_at', 'updated_at']
