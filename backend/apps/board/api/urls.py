from django.urls import path
from .views import (
    CommandCenterView, SystemHealthView, MRRView, GlobalSearchView,
    RevenueReportView, CRMReportView, SupportReportView, SecurityReportView,
    ExportReportView
)

urlpatterns = [
    path('metrics/', CommandCenterView.as_view(), name='command-center-metrics'),
    path('health/', SystemHealthView.as_view(), name='system-health-status'),
    path('mrr/', MRRView.as_view(), name='executive-mrr'),
    path('search/', GlobalSearchView.as_view(), name='global-search'),
    path('revenue/', RevenueReportView.as_view(), name='revenue-report'),
    path('crm/', CRMReportView.as_view(), name='crm-report'),
    path('support/', SupportReportView.as_view(), name='support-report'),
    path('security/', SecurityReportView.as_view(), name='security-report'),
    path('export/<str:type>/', ExportReportView.as_view(), name='export-report'),
]
