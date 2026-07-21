from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, PurchaseOrderViewSet, PurchaseOrderLineViewSet, RFQViewSet, VendorPricelistViewSet, PurchaseDashboardView

router = DefaultRouter()
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'purchase-order-lines', PurchaseOrderLineViewSet, basename='po-line')
router.register(r'rfqs', RFQViewSet, basename='rfq')
router.register(r'vendor-pricelists', VendorPricelistViewSet, basename='vendor-pricelist')

urlpatterns = [
    path('dashboard/', PurchaseDashboardView.as_view(), name='purchase-dashboard'),
    path('', include(router.urls))
]
