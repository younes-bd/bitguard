from django.contrib import admin
from .models import Product, LicenseKey

class LicenseKeyInline(admin.TabularInline):
    model = LicenseKey
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'product_type', 'is_active', 'created_at', 'stock_quantity')
    list_filter = ('product_type', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [LicenseKeyInline]

@admin.register(LicenseKey)
class LicenseKeyAdmin(admin.ModelAdmin):
    list_display = ('key', 'product', 'is_used', 'user', 'assigned_at')
    list_filter = ('is_used', 'product')
    search_fields = ('key', 'user__username')
