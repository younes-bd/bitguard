from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExportCRMCSV,
    CRMReportView,
    ClientViewSet, ContactViewSet, LeadViewSet, DealViewSet, ActivityViewSet,
    CrmStageViewSet, CrmSalesTeamViewSet, LostReasonViewSet, CrmTagViewSet, DashboardStatsView
)

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'stages', CrmStageViewSet, basename='stage')
router.register(r'teams', CrmSalesTeamViewSet, basename='team')
router.register(r'lost-reasons', LostReasonViewSet, basename='lost-reason')
router.register(r'tags', CrmTagViewSet, basename='tag')

urlpatterns = [
    path('report/export/', ExportCRMCSV.as_view(), name='crm-export-csv'),
    path('report/metrics/', CRMReportView.as_view(), name='crm-metrics-report'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
