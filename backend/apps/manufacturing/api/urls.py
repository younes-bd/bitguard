from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WorkCenterViewSet, BillOfMaterialViewSet, ManufacturingOrderViewSet,
    RoutingViewSet, WorkOrderViewSet, ScrapOrderViewSet
)

router = DefaultRouter()
router.register(r'work-centers', WorkCenterViewSet, basename='mrp-workcenter')
router.register(r'boms', BillOfMaterialViewSet, basename='mrp-bom')
router.register(r'orders', ManufacturingOrderViewSet, basename='mrp-order')
router.register(r'routings', RoutingViewSet, basename='mrp-routing')
router.register(r'work-orders', WorkOrderViewSet, basename='mrp-workorder')
router.register(r'scrap-orders', ScrapOrderViewSet, basename='mrp-scraporder')

urlpatterns = [
    path('', include(router.urls)),
]
