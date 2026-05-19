from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import ReportService


class RevenueReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        return Response({'status': 'success', 'data': ReportService.get_revenue_report(tenant)})


class CrmReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        return Response({'status': 'success', 'data': ReportService.get_crm_report(tenant)})


class SupportReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        return Response({'status': 'success', 'data': ReportService.get_support_report(tenant)})


class SecurityReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        return Response({'status': 'success', 'data': ReportService.get_security_report(tenant)})


import csv
from django.http import HttpResponse

class ExportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, report_type):
        tenant = getattr(request, 'tenant', None)
        
        response = HttpResponse(
            content_type='text/csv',
            headers={'Content-Disposition': f'attachment; filename="{report_type}_report.csv"'},
        )
        writer = csv.writer(response)
        
        if report_type == 'revenue':
            data = ReportService.get_revenue_report(tenant)
            writer.writerow(['Metric', 'Value'])
            writer.writerow(['Total Revenue', data.get('total_revenue', 0)])
            writer.writerow(['Monthly Recurring Revenue', data.get('mrr', 0)])
            writer.writerow(['Active Subscriptions', data.get('active_subscriptions', 0)])
            writer.writerow(['Churn Rate (%)', data.get('churn_rate', 0)])
            
        elif report_type == 'crm':
            data = ReportService.get_crm_report(tenant)
            writer.writerow(['Metric', 'Value'])
            writer.writerow(['Total Clients', data.get('total_clients', 0)])
            writer.writerow(['Active Deals', data.get('active_deals', 0)])
            writer.writerow(['Win Rate (%)', data.get('win_rate', 0)])
            writer.writerow(['Pipeline Value', data.get('pipeline_value', 0)])
            
        elif report_type == 'support':
            data = ReportService.get_support_report(tenant)
            writer.writerow(['Metric', 'Value'])
            writer.writerow(['Open Tickets', data.get('open_tickets', 0)])
            writer.writerow(['Resolved Today', data.get('resolved_today', 0)])
            writer.writerow(['Avg Resolution Time (hrs)', data.get('avg_resolution_time', 0)])
            writer.writerow(['SLA Compliance (%)', data.get('sla_compliance', 0)])
            
        elif report_type == 'security':
            data = ReportService.get_security_report(tenant)
            writer.writerow(['Metric', 'Value'])
            writer.writerow(['Active Alerts', data.get('active_alerts', 0)])
            writer.writerow(['Critical Incidents', data.get('critical_incidents', 0)])
            writer.writerow(['Endpoints Monitored', data.get('endpoints_monitored', 0)])
            writer.writerow(['Threat Level', data.get('threat_level', 'Low')])
            
        else:
            return Response({'error': 'Invalid report type'}, status=400)
            
        return response