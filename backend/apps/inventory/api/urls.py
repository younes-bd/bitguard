from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WarehouseViewSet, InventoryItemViewSet, GoodsReceiptViewSet, 
    GoodsReceiptLineViewSet, InventoryMoveViewSet, InventoryAdjustmentViewSet, 
    ReorderRuleViewSet, InventoryDashboardView,
    InventoryLotViewSet, StorageLocationViewSet, InventoryPickingViewSet
)

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'items', InventoryItemViewSet, basename='inventory')
router.register(r'goods-receipts', GoodsReceiptViewSet, basename='goods-receipt')
router.register(r'goods-receipt-lines', GoodsReceiptLineViewSet, basename='goods-receipt-line')
router.register(r'stock-moves', InventoryMoveViewSet, basename='stock-move')
router.register(r'stock-adjustments', InventoryAdjustmentViewSet, basename='stock-adjustment')
router.register(r'reorder-rules', ReorderRuleViewSet, basename='reorder-rule')

router.register(r'lots', InventoryLotViewSet, basename='stock-lot')
router.register(r'locations', StorageLocationViewSet, basename='storage-location')
router.register(r'pickings', InventoryPickingViewSet, basename='stock-picking')

urlpatterns = [
    path('dashboard/', InventoryDashboardView.as_view(), name='inventory-dashboard'),
    path('', include(router.urls))
]
