from rest_framework import serializers
from ..domain.models import (
    Product, ProductVariant, ProductAttribute, ProductAttributeValue,
    Category, ProductReview, ProductTag
)


class ProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTag
        fields = ['id', 'name', 'color']
        read_only_fields = ['id']


class CategorySerializer(serializers.ModelSerializer):
    complete_name = serializers.CharField(read_only=True)
    parent_name = serializers.CharField(source='parent_category.name', read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'website', 'parent_category', 'parent_name', 'complete_name',
            'name', 'slug', 'description', 'image', 'is_visible', 'sort_order', 'product_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

    def get_product_count(self, obj):
        return obj.products.count()


class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['id', 'name']
        read_only_fields = ['id']


class ProductAttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)

    class Meta:
        model = ProductAttributeValue
        fields = ['id', 'attribute', 'attribute_name', 'value', 'sort_order']
        read_only_fields = ['id']


class ProductVariantSerializer(serializers.ModelSerializer):
    attribute_values_details = ProductAttributeValueSerializer(source='attribute_values', many=True, read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    variant_label = serializers.CharField(source='__str__', read_only=True)

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'product', 'product_name', 'variant_label',
            'attribute_values', 'attribute_values_details',
            'sku', 'barcode', 'price_extra', 'stock_quantity', 'image', 'is_active'
        ]
        read_only_fields = ['id']


class ProductReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'product_name', 'user', 'username',
            'rating', 'title', 'comment', 'is_approved', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user']


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    tags = ProductTagSerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='categories', many=True,
        write_only=True, required=False
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=ProductTag.objects.all(), source='tags', many=True,
        write_only=True, required=False
    )
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    responsible_name = serializers.CharField(source='responsible.get_full_name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'internal_reference', 'barcode', 'sku',
            'website', 'responsible', 'responsible_name',
            'tags', 'tag_ids', 'categories', 'category_ids',
            'description', 'description_purchase', 'description_sale',
            'product_type', 'status',
            'sales_ok', 'purchase_ok', 'is_featured', 'can_be_expensed',
            'price', 'discount_price', 'stripe_price_id',
            'file', 'image',
            'brand', 'vendor', 'weight', 'dimensions', 'warranty_months', 'tracking',
            'license_type', 'delivery_type',
            'min_quantity', 'max_quantity', 'sort_order',
            'specifications', 'features',
            'stock_quantity', 'track_stock',
            'is_rental', 'rental_pricing',
            'unit_label', 'tax_config', 'income_account', 'expense_account',
            'variants', 'reviews', 'review_count', 'average_rating',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        extra_kwargs = {'stripe_price_id': {'write_only': True}}

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if not reviews.exists():
            return None
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    category_names = serializers.SerializerMethodField()
    tag_names = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    variant_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'internal_reference', 'sku',
            'product_type', 'status', 'price', 'discount_price',
            'image', 'brand', 'is_featured', 'sales_ok', 'purchase_ok',
            'stock_quantity', 'track_stock',
            'category_names', 'tag_names', 'review_count', 'variant_count',
            'created_at',
        ]

    def get_category_names(self, obj):
        return [c.name for c in obj.categories.all()]

    def get_tag_names(self, obj):
        return [t.name for t in obj.tags.all()]

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_variant_count(self, obj):
        return obj.variants.count()
