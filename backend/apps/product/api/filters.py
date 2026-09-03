import django_filters
from ..domain.models import Product, Category, ProductVariant


class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    brand = django_filters.CharFilter(lookup_expr='icontains')
    sku = django_filters.CharFilter(field_name='sku', lookup_expr='icontains')
    internal_reference = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.CharFilter()
    product_type = django_filters.CharFilter()
    is_featured = django_filters.BooleanFilter()
    sales_ok = django_filters.BooleanFilter()
    purchase_ok = django_filters.BooleanFilter()
    is_rental = django_filters.BooleanFilter()
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all(),
        field_name='categories',
        label='Category'
    )
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Product
        fields = [
            'name', 'brand', 'sku', 'internal_reference', 'status',
            'product_type', 'is_featured', 'sales_ok', 'purchase_ok',
            'is_rental', 'price_min', 'price_max', 'category',
        ]


class CategoryFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    is_visible = django_filters.BooleanFilter()
    parent = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all(),
        field_name='parent_category'
    )

    class Meta:
        model = Category
        fields = ['name', 'is_visible', 'parent_category']
