from django.db.models import Count, Avg, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.api.mixins import TenantScopedMixin
from ..domain.models import (
    Category, Product, ProductAttribute, ProductAttributeValue,
    ProductVariant, ProductReview, ProductTag
)
from .serializers import (
    CategorySerializer, ProductSerializer, ProductListSerializer,
    ProductAttributeSerializer, ProductAttributeValueSerializer,
    ProductVariantSerializer, ProductReviewSerializer, ProductTagSerializer
)
from .filters import ProductFilter, CategoryFilter


class ProductTagViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']


class CategoryViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CategoryFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'sort_order', 'created_at']

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)


class ProductViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Product.objects.prefetch_related(
        'variants', 'categories', 'reviews', 'tags'
    ).order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'brand', 'sku', 'internal_reference', 'barcode']
    ordering_fields = ['name', 'price', 'created_at', 'sort_order', 'stock_quantity']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, responsible=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def archive(self, request, pk=None):
        product = self.get_object()
        product.status = 'archived'
        product.save(update_fields=['status'])
        return Response({'status': 'archived', 'id': product.id})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unarchive(self, request, pk=None):
        product = self.get_object()
        product.status = 'active'
        product.save(update_fields=['status'])
        return Response({'status': 'active', 'id': product.id})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def duplicate(self, request, pk=None):
        from .services import ProductService
        product = self.get_object()
        new_product = ProductService.duplicate_product(product)
        serializer = ProductSerializer(new_product, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def stats(self, request):
        from .services import ProductService
        tenant = getattr(request.user, 'tenant', None)
        stats_data = ProductService.get_stats(tenant)
        return Response(stats_data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def checkout(self, request, pk=None):
        product = self.get_object()
        success_url = request.data.get('success_url') or request.build_absolute_uri('/')
        cancel_url = request.data.get('cancel_url') or request.build_absolute_uri('/')
        try:
            from apps.ecommerce.application.services import CommerceService
            checkout_url = CommerceService.create_checkout_session(
                user=request.user, product=product,
                success_url=success_url, cancel_url=cancel_url, request=request
            )
            return Response({'checkout_url': checkout_url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProductAttributeViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ProductAttribute.objects.prefetch_related('values').all()
    serializer_class = ProductAttributeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']


class ProductAttributeValueViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ProductAttributeValue.objects.select_related('attribute').all()
    serializer_class = ProductAttributeValueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['attribute']
    search_fields = ['value']


class ProductVariantViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ProductVariant.objects.select_related('product').prefetch_related('attribute_values').all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product', 'is_active']
    search_fields = ['sku', 'barcode', 'product__name']


class ProductReviewViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ProductReview.objects.select_related('product', 'user').all()
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product', 'rating', 'is_approved']
    search_fields = ['title', 'comment', 'product__name']
    ordering_fields = ['created_at', 'rating']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve(self, request, pk=None):
        review = self.get_object()
        review.is_approved = True
        review.save(update_fields=['is_approved'])
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        review = self.get_object()
        review.is_approved = False
        review.save(update_fields=['is_approved'])
        return Response({'status': 'rejected'})
