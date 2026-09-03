from rest_framework import serializers
from ..domain.models import Plan, Subscription, BillingSettings

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'slug', 'price_monthly', 'price_yearly', 'stripe_price_id_monthly', 'stripe_price_id_yearly', 'included_modules', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'plan_name', 'stripe_subscription_id', 'stripe_customer_id', 'status', 'current_period_end', 'cancel_at_period_end', 'tenant', 'created_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class BillingSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingSettings
        fields = ['merchant_name', 'currency', 'tax_rate', 'email_notifications', 'auto_process_orders']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
