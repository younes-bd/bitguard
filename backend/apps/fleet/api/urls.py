from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, VehicleLogViewSet, VehicleContractViewSet, VehicleBrandViewSet, VehicleModelViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='fleet-vehicle')
router.register(r'brands', VehicleBrandViewSet, basename='fleet-brand')
router.register(r'models', VehicleModelViewSet, basename='fleet-model')
router.register(r'logs', VehicleLogViewSet, basename='fleet-log')
router.register(r'contracts', VehicleContractViewSet, basename='fleet-contract')

from .views import DashboardStatsView

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
