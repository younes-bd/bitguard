from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, AssetAssignmentViewSet, MaintenanceRecordViewSet

router = DefaultRouter()
router.register('assets', AssetViewSet, basename='asset')
router.register('assignments', AssetAssignmentViewSet, basename='asset-assignment')
router.register('maintenance', MaintenanceRecordViewSet, basename='maintenance-record')

urlpatterns = router.urls
