from rest_framework.routers import DefaultRouter
from apps.hr_attendance.api.views import AttendanceViewSet

router = DefaultRouter()
router.register(r'attendances', AttendanceViewSet)

urlpatterns = router.urls
