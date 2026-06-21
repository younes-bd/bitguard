from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleOrderViewSet, SaleOrderLineViewSet

router = DefaultRouter()
router.register(r'orders', SaleOrderViewSet, basename='sale-order')
router.register(r'order-lines', SaleOrderLineViewSet, basename='sale-order-line')

urlpatterns = [
    path('', include(router.urls)),
]
