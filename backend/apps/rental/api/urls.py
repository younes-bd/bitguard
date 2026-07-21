from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RentalOrderViewSet, RentalOrderLineViewSet

router = DefaultRouter()
router.register(r'orders', RentalOrderViewSet, basename='rental-order')
router.register(r'order-lines', RentalOrderLineViewSet, basename='rental-orderline')

urlpatterns = [
    path('', include(router.urls)),
]
