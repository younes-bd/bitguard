from django.contrib import admin
from .models import (
    StoreCustomization, Category, Product, LicenseKey, CustomerProfile,
    Order, OrderItem, OrderTimeline, ShippingSetting, LandingPage, TrackingConfig,
    AddOn, SubscriptionPlan, Subscription, StoreSetting, PartnerRequest
)

class LicenseKeyInline(admin.TabularInline):
    model = LicenseKey
    extra = 1

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderTimelineInline(admin.TabularInline):
    model = OrderTimeline
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'product_type', 'brand', 'delivery_type', 'status', 'created_at', 'stock_quantity')
    list_filter = ('product_type', 'status', 'delivery_type', 'brand')
    search_fields = ('name', 'description', 'brand', 'sku')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [LicenseKeyInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_visible', 'parent_category', 'tenant')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'fulfillment_status')
    search_fields = ('id', 'user__username', 'payment_intent_id')
    inlines = [OrderItemInline, OrderTimelineInline]

@admin.register(LicenseKey)
class LicenseKeyAdmin(admin.ModelAdmin):
    list_display = ('key', 'product', 'is_used', 'user', 'assigned_at')
    list_filter = ('is_used', 'product')
    search_fields = ('key', 'user__username')

@admin.register(StoreCustomization)
class StoreCustomizationAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'active_theme')

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'created_at')
    search_fields = ('user__email', 'user__username')

@admin.register(ShippingSetting)
class ShippingSettingAdmin(admin.ModelAdmin):
    list_display = ('zone_name', 'rate', 'tenant')

@admin.register(LandingPage)
class LandingPageAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'created_at')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(TrackingConfig)
class TrackingConfigAdmin(admin.ModelAdmin):
    list_display = ('tenant',)

@admin.register(AddOn)
class AddOnAdmin(admin.ModelAdmin):
    list_display = ('name', 'provider', 'is_enabled')

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'billing_cycle', 'is_active')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'plan', 'status', 'next_renewal_date')

@admin.register(StoreSetting)
class StoreSettingAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'currency')

@admin.register(PartnerRequest)
class PartnerRequestAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'contact_person', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('company_name', 'contact_person', 'email')
