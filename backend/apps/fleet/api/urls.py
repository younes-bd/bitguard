from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, VehicleLogViewSet, VehicleContractViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='fleet-vehicle')
router.register(r'logs', VehicleLogViewSet, basename='fleet-log')
router.register(r'contracts', VehicleContractViewSet, basename='fleet-contract')

urlpatterns = [
    path('', include(router.urls)),
]
