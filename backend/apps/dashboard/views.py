from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services.analytics import CommandCenterAnalyticsService
from .services.health import SystemHealthService

class CommandCenterView(APIView):
    """
    BFF View: Exposes aggregated business metrics for the Command Center.
    Requires Tenant isolation if a Tenant user is requesting it,
    or returns global stats if SuperAdmin.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        # If user is admin (staff/superuser) and explicitly choosing no tenant, see global stats
        if request.user.is_staff and not tenant:
            metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=None)
        else:
            # Tenant-scoped dashboard
            metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=tenant)
            
        return Response({
            "status": "success",
            "data": metrics
        })

class SystemHealthView(APIView):
    """
    BFF View: Exposes infrastructure metrics (CPU, DB, Memory).
    Restricted to SuperAdmins.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Forbidden: Requires System Administrator privileges"}, status=403)
            
        health_data = SystemHealthService.get_system_status()
        return Response({
            "status": "success",
            "data": health_data
        })

class MRRView(APIView):
    """
    BFF View: Exposes Executive MRR Revenue and Churn metrics.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not getattr(request.user, 'is_staff', False):
             return Response({"error": "Forbidden"}, status=403)
             
        # In a real app, this would aggregate from Stripe/Billing. Using mock data for beta.
        return Response({
            "status": "success",
            "data": {
                "mrr": 18500, "arr": 222000, "mrr_growth": 12.4,
                "new_mrr": 2800, "churned_mrr": 340, "expansion_mrr": 950,
                "active_subscriptions": 47, "churn_rate": 1.84,
                "monthly_history": [
                    { "month": 'Sep', "mrr": 13200 }, { "month": 'Oct', "mrr": 14800 },
                    { "month": 'Nov', "mrr": 15600 }, { "month": 'Dec', "mrr": 16800 },
                    { "month": 'Jan', "mrr": 17500 }, { "month": 'Feb', "mrr": 18500 },
                ]
            }
        })