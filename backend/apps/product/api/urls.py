from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, ProductAttributeViewSet,
    ProductAttributeValueViewSet, ProductVariantViewSet,
    ProductReviewViewSet, ProductTagViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='product-category')
router.register(r'products', ProductViewSet, basename='product-product')
router.register(r'attributes', ProductAttributeViewSet, basename='product-attribute')
router.register(r'attribute-values', ProductAttributeValueViewSet, basename='product-attribute-value')
router.register(r'variants', ProductVariantViewSet, basename='product-variant')
router.register(r'reviews', ProductReviewViewSet, basename='product-review')
router.register(r'tags', ProductTagViewSet, basename='product-tag')

urlpatterns = [
    path('', include(router.urls)),
]
