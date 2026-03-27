from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, InventoryItemViewSet, PurchaseOrderViewSet, PurchaseOrderLineViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'inventory', InventoryItemViewSet, basename='inventory')
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'purchase-order-lines', PurchaseOrderLineViewSet, basename='po-line')

urlpatterns = [path('', include(router.urls))]
