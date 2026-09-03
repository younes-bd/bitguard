from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PosConfigViewSet, PosSessionViewSet, PosOrderViewSet, PosPaymentViewSet, RestaurantFloorViewSet, RestaurantTableViewSet, RestaurantPrinterViewSet

router = DefaultRouter()
router.register(r'configs', PosConfigViewSet, basename='pos-config')
router.register(r'sessions', PosSessionViewSet, basename='pos-session')
router.register(r'orders', PosOrderViewSet, basename='pos-order')
router.register(r'payments', PosPaymentViewSet, basename='pos-payment')
router.register(r'floors', RestaurantFloorViewSet, basename='pos-floor')
router.register(r'tables', RestaurantTableViewSet, basename='pos-table')
router.register(r'printers', RestaurantPrinterViewSet, basename='pos-printer')

from .views import DashboardStatsView

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
