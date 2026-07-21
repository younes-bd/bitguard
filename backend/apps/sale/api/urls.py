from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (SaleOrderViewSet, SaleOrderLineViewSet,
                    SalesTeamViewSet, PricelistViewSet,
                    QuotationTemplateViewSet)

router = DefaultRouter()
router.register(r'orders', SaleOrderViewSet, basename='sale-order')
router.register(r'order-lines', SaleOrderLineViewSet, basename='sale-order-line')
router.register(r'teams', SalesTeamViewSet, basename='sale-team')
router.register(r'pricelists', PricelistViewSet, basename='sale-pricelist')
router.register(r'templates', QuotationTemplateViewSet, basename='sale-template')

urlpatterns = [
    path('', include(router.urls)),
]
