from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated

# Core API views are now distributed to their respective apps.
# This file is kept for potential shared base viewsets or utilities.

from django.db.models import Sum, Count
from django.contrib.auth import get_user_model
from apps.store.models import Order
from apps.security.models import SecurityAlert, SecurityIncident
from rest_framework.views import APIView

# Try importing optional modules to avoid hard failures if apps are disabled
try:
    from apps.erp.models import Project
except ImportError:
    Project = None

try:
    from apps.crm.models import Client
except ImportError:
    Client = None

class DashboardKPIView(APIView):
    """
    Aggregates Key Performance Indicators (KPIs) for the main admin dashboard.
    Centralizes data fetching to improve performance and security.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Revenue (Total from processed orders)
        revenue_agg = Order.objects.aggregate(total=Sum('amount'))
        total_revenue = revenue_agg['total'] or 0.0

        # 2. Key Counts
        active_projects = Project.objects.filter(status='active').count() if Project else 0
        total_clients = Client.objects.count() if Client else 0
        active_users = get_user_model().objects.filter(is_active=True).count()

        # 3. Security Snapshot
        open_alerts = SecurityAlert.objects.exclude(status='resolved').count()
        active_incidents = SecurityIncident.objects.exclude(status='closed').count()

        # 4. Recent Activity (Simplistic aggregation)
        # In a real scenario, we might query a unified AuditLog model.
        # Here we mock it with recent security alerts for demonstration.
        recent_alerts = SecurityAlert.objects.order_by('-timestamp')[:5]
        activity_feed = [
            {
                'id': f'alert-{a.id}',
                'type': 'security',
                'description': f"Alert: {a.title}",
                'timestamp': a.timestamp,
                'status': a.severity
            }
            for a in recent_alerts
        ]

        # 5. Chart Data (Mocking history for now, but structure is ready for real data)
        # TODO: Implement actual time-series aggregation from Orders/Logs
        chart_data = {
            'revenue': [10, 25, 20, 40, 35, 50, 65, 55, 80], # Placeholder
            'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }

        return Response({
            'kpi': {
                'revenue': total_revenue,
                'active_projects': active_projects,
                'total_clients': total_clients,
                'active_users': active_users,
                'security_alerts': open_alerts,
                'active_incidents': active_incidents
            },
            'activity': activity_feed,
            'charts': chart_data
        })
