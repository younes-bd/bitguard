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