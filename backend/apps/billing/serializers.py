from rest_framework import serializers
from .models import Invoice, Plan, Subscription, BillingSettings

class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'user', 'customer_name', 'tenant', 'status', 'amount', 'currency', 'payment_method', 'stripe_invoice_id', 'pdf_url', 'due_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'tenant', 'created_at', 'updated_at']

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'slug', 'price_monthly', 'price_yearly', 'stripe_price_id_monthly', 'stripe_price_id_yearly', 'included_modules', 'is_active', 'created_at', 'updated_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'plan_name', 'stripe_subscription_id', 'stripe_customer_id', 'status', 'current_period_end', 'cancel_at_period_end', 'tenant', 'created_at']

class BillingSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingSettings
        fields = ['merchant_name', 'currency', 'tax_rate', 'email_notifications', 'auto_process_orders']
