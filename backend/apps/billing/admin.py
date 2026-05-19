from django.contrib import admin
from .models import Plan, Subscription, Invoice, BillingSettings

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

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'user', 'amount', 'status', 'due_date')
    list_filter = ('status', 'due_date')
    search_fields = ('user__username', 'invoice_number', 'stripe_invoice_id')
    readonly_fields = ('stripe_invoice_id', 'pdf_url')
    actions = ['mark_paid']

    def mark_paid(self, request, queryset):
        queryset.update(status='paid')
    mark_paid.short_description = "Mark selected invoices as paid"

@admin.register(BillingSettings)
class BillingSettingsAdmin(admin.ModelAdmin):
    list_display = ('merchant_name', 'currency', 'tax_rate')
    
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
