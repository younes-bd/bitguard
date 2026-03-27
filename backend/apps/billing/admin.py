from django.contrib import admin
from .models import Plan, Subscription, Order, BillingSettings

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_monthly', 'price_yearly', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'current_period_end', 'cancel_at_period_end')
    list_filter = ('status', 'plan', 'cancel_at_period_end')
    search_fields = ('user__username', 'user__email', 'stripe_subscription_id')
    readonly_fields = ('stripe_subscription_id',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product_name', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'stripe_session', 'id')
    readonly_fields = ('stripe_session',)
    actions = ['mark_completed']

    def mark_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_completed.short_description = "Mark selected orders as completed"

@admin.register(BillingSettings)
class BillingSettingsAdmin(admin.ModelAdmin):
    list_display = ('merchant_name', 'currency', 'tax_rate')
    
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
