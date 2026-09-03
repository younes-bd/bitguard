from rest_framework.routers import DefaultRouter
from apps.equity.api.views import ShareClassViewSet, ShareholderViewSet

router = DefaultRouter()
router.register(r'share-classs', ShareClassViewSet)
router.register(r'shareholders', ShareholderViewSet)

urlpatterns = router.urls
