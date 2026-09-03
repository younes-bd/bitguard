from rest_framework.routers import DefaultRouter
from apps.hr_appraisal.api.views import AppraisalViewSet, PerformanceAppraisalViewSet, PerformanceReviewViewSet

router = DefaultRouter()
router.register(r'appraisals', AppraisalViewSet)
router.register(r'performance-appraisals', PerformanceAppraisalViewSet)
router.register(r'performance-reviews', PerformanceReviewViewSet)

urlpatterns = router.urls
