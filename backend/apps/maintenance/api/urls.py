from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, AssetAssignmentViewSet, MaintenanceRecordViewSet, ItamDashboardView, SoftwareLicenseViewSet, AssetDepreciationView

router = DefaultRouter()
router.register('maintenance', AssetViewSet, basename='asset')
router.register('assignments', AssetAssignmentViewSet, basename='asset-assignment')
router.register('maintenance', MaintenanceRecordViewSet, basename='maintenance-record')

router.register('licenses', SoftwareLicenseViewSet, basename='software-license')

urlpatterns = [
    path('dashboard/', ItamDashboardView.as_view(), name='itam-dashboard'),
    path('depreciation/', AssetDepreciationView.as_view(), name='itam-depreciation'),
    path('', include(router.urls)),
]
