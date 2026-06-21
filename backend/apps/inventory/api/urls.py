from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseViewSet, InventoryItemViewSet, GoodsReceiptViewSet, GoodsReceiptLineViewSet, StockMoveViewSet, StockAdjustmentViewSet, ReorderRuleViewSet, DeliveryNoteViewSet, InventoryDashboardView

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'items', InventoryItemViewSet, basename='inventory')
router.register(r'goods-receipts', GoodsReceiptViewSet, basename='goods-receipt')
router.register(r'goods-receipt-lines', GoodsReceiptLineViewSet, basename='goods-receipt-line')
router.register(r'stock-moves', StockMoveViewSet, basename='stock-move')
router.register(r'stock-adjustments', StockAdjustmentViewSet, basename='stock-adjustment')
router.register(r'reorder-rules', ReorderRuleViewSet, basename='reorder-rule')
router.register(r'delivery-notes', DeliveryNoteViewSet, basename='delivery-note')

urlpatterns = [
    path('dashboard/', InventoryDashboardView.as_view(), name='inventory-dashboard'),
    path('', include(router.urls))
]
