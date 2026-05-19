from django.urls import path
from .views import RevenueReportView, CrmReportView, SupportReportView, SecurityReportView, ExportCSVView

urlpatterns = [
    path('revenue/', RevenueReportView.as_view(), name='report-revenue'),
    path('crm/', CrmReportView.as_view(), name='report-crm'),
    path('support/', SupportReportView.as_view(), name='report-support'),
    path('security/', SecurityReportView.as_view(), name='report-security'),
    path('export/<str:report_type>/', ExportCSVView.as_view(), name='report-export-csv'),
]
