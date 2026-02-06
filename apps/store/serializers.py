from rest_framework import serializers
from .models import Product, Order, Plan, Subscription, StoreSettings, LicenseKey

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = Subscription
        fields = '__all__'

class LicenseKeySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = LicenseKey
        fields = '__all__'

class StoreSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSettings
        fields = ['store_name', 'currency', 'tax_rate', 'email_notifications', 'auto_process_orders']
