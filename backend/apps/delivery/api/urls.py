from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryNoteViewSet, ShippingMethodViewSet

router = DefaultRouter()
router.register(r'delivery-notes', DeliveryNoteViewSet, basename='delivery-note')
router.register(r'shipping-methods', ShippingMethodViewSet, basename='shipping-method')

urlpatterns = [
    path('', include(router.urls)),
]
