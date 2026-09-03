from django.contrib import admin
from .domain.models import Product, ProductVariant, Category, ProductAttribute, ProductAttributeValue, ProductReview, ProductTag


@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'tenant')
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'product_type', 'brand', 'delivery_type', 'status', 'stock_quantity', 'is_featured', 'created_at')
    list_filter = ('product_type', 'status', 'delivery_type', 'brand', 'is_featured', 'sales_ok', 'purchase_ok')
    search_fields = ('name', 'description', 'brand', 'sku', 'internal_reference', 'barcode')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('categories', 'tags', 'components')
    readonly_fields = ('created_at', 'updated_at', 'created_by')


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'sku', 'price_extra', 'stock_quantity', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('sku', 'barcode', 'product__name')
    filter_horizontal = ('attribute_values',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('complete_name', 'is_visible', 'parent_category', 'sort_order', 'tenant')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    list_filter = ('is_visible',)


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant')
    search_fields = ('name',)


@admin.register(ProductAttributeValue)
class ProductAttributeValueAdmin(admin.ModelAdmin):
    list_display = ('attribute', 'value', 'sort_order')
    list_filter = ('attribute',)
    search_fields = ('value', 'attribute__name')


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved')
    search_fields = ('product__name', 'user__username', 'title')
    actions = ['approve_reviews', 'reject_reviews']

    @admin.action(description='Approve selected reviews')
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description='Reject selected reviews')
    def reject_reviews(self, request, queryset):
        queryset.update(is_approved=False)
