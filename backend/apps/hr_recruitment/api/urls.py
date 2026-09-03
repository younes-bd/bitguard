from rest_framework.routers import DefaultRouter
from apps.hr_recruitment.api.views import JobPositionViewSet, JobApplicationViewSet, JobApplicantViewSet

router = DefaultRouter()
router.register(r'job-positions', JobPositionViewSet)
router.register(r'job-applications', JobApplicationViewSet)
router.register(r'job-applicants', JobApplicantViewSet)

urlpatterns = router.urls
