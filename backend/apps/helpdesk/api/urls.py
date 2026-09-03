from rest_framework.routers import DefaultRouter
from .views import (
    TicketViewSet, KnowledgeArticleViewSet,
    HelpdeskTeamViewSet, HelpdeskStageViewSet, HelpdeskTagViewSet, SlaPolicyViewSet
)

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'articles', KnowledgeArticleViewSet, basename='article')
router.register(r'teams', HelpdeskTeamViewSet, basename='helpdeskteam')
router.register(r'stages', HelpdeskStageViewSet, basename='helpdeskstage')
router.register(r'tags', HelpdeskTagViewSet, basename='helpdesktag')
router.register(r'sla-policies', SlaPolicyViewSet, basename='slapolicy')

urlpatterns = router.urls

from django.urls import path
from .views import SupportReportView, ExportSupportCSV

urlpatterns += [
    path('report/metrics/', SupportReportView.as_view(), name='helpdesk-metrics-report'),
    path('report/export/', ExportSupportCSV.as_view(), name='helpdesk-export-csv'),
]
