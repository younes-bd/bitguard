from rest_framework import serializers
from .models import (
    StoreCustomization, Category, Product, LicenseKey, CustomerProfile,
    Order, OrderItem, OrderTimeline, ShippingSetting, LandingPage, TrackingConfig,
    AddOn, SubscriptionPlan, Subscription, StoreSetting, PartnerRequest
)

class StoreCustomizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreCustomization
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='categories', many=True, write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = '__all__'

class LicenseKeySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = LicenseKey
        fields = '__all__'

class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = CustomerProfile
        fields = '__all__'

class OrderTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderTimeline
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    timeline = OrderTimelineSerializer(many=True, read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    product_details = ProductSerializer(source='product', read_only=True)
    customer_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class ShippingSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingSetting
        fields = '__all__'

class LandingPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPage
        fields = '__all__'

class TrackingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingConfig
        fields = '__all__'

class AddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = '__all__'

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_details = SubscriptionPlanSerializer(source='plan', read_only=True)
    customer_details = CustomerProfileSerializer(source='customer', read_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'

class StoreSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSetting
        fields = '__all__'

class PartnerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerRequest
        fields = '__all__'
