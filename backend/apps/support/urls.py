from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, KnowledgeArticleViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'articles', KnowledgeArticleViewSet, basename='article')

urlpatterns = router.urls
