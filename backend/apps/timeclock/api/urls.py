from rest_framework.routers import DefaultRouter
from apps.timeclock.api.views import AttendanceViewSet

router = DefaultRouter()
router.register(r'attendances', AttendanceViewSet)

urlpatterns = router.urls
