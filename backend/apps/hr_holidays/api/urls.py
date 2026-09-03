from rest_framework.routers import DefaultRouter
from apps.hr_holidays.api.views import LeaveRequestViewSet, LeaveAllocationViewSet

router = DefaultRouter()
router.register(r'leave-requests', LeaveRequestViewSet)
router.register(r'leave-allocations', LeaveAllocationViewSet)

urlpatterns = router.urls
