from rest_framework.routers import DefaultRouter
from apps.esg.api.views import EsgMetricViewSet, EsgTargetViewSet

router = DefaultRouter()
router.register(r'esg-metrics', EsgMetricViewSet)
router.register(r'esg-targets', EsgTargetViewSet)

urlpatterns = router.urls
