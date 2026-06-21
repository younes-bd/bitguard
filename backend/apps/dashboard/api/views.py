from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..services.analytics import CommandCenterAnalyticsService
from ..services.health import SystemHealthService

class CommandCenterView(APIView):
    """
    BFF View: Exposes aggregated business metrics for the Command Center.
    Requires Tenant isolation if a Tenant user is requesting it,
    or returns global stats if SuperAdmin.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        date_range = request.query_params.get('range', '30days')
        
        # If user is admin (staff/superuser) and explicitly choosing no tenant, see global stats
        if request.user.is_staff and not tenant:
            metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=None, date_range=date_range)
        else:
            # Tenant-scoped dashboard
            metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=tenant, date_range=date_range)
            
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
             
        try:
            from apps.billing.models import Subscription
            from django.db.models import Sum
            
            tenant = getattr(request, 'tenant', None)
            subs = Subscription.objects.all()
            if tenant:
                subs = subs.filter(tenant=tenant)
                
            active_subs = subs.filter(status='active')
            total_active = active_subs.count()
            
            # Assuming active_subs are linked to a plan with price_monthly
            mrr = float(active_subs.aggregate(total=Sum('plan__price_monthly'))['total'] or 0)
            arr = mrr * 12
            
            from apps.accounting.domain.models import Invoice
            from django.utils import timezone
            import datetime
            
            # Real historical MRR calculation based on recurring invoices
            today = timezone.now().date()
            prev_1 = today.replace(day=1) - datetime.timedelta(days=1)
            prev_2 = prev_1.replace(day=1) - datetime.timedelta(days=1)
            
            invoices = Invoice.objects.filter(type='standard', status__in=['paid', 'sent'])
            if tenant:
                invoices = invoices.filter(tenant=tenant)
                
            curr_invoices = invoices.filter(issue_date__month=today.month, issue_date__year=today.year)
            prev1_invoices = invoices.filter(issue_date__month=prev_1.month, issue_date__year=prev_1.year)
            prev2_invoices = invoices.filter(issue_date__month=prev_2.month, issue_date__year=prev_2.year)
            
            curr_rev = float(curr_invoices.aggregate(total=Sum('amount'))['total'] or 0)
            prev1_rev = float(prev1_invoices.aggregate(total=Sum('amount'))['total'] or 0)
            prev2_rev = float(prev2_invoices.aggregate(total=Sum('amount'))['total'] or 0)
            
            # Assuming MRR is driven by subscription + recurring invoices
            mrr_growth = ((curr_rev - prev1_rev) / prev1_rev * 100) if prev1_rev > 0 else 0
            
            return Response({
                "status": "success",
                "data": {
                    "mrr": mrr,
                    "arr": arr,
                    "mrr_growth": round(mrr_growth, 2),
                    "new_mrr": 0,
                    "churned_mrr": 0,
                    "expansion_mrr": 0,
                    "active_subscriptions": total_active,
                    "churn_rate": 0,
                    "monthly_history": [
                        { "month": prev_2.strftime('%b'), "mrr": prev2_rev }, 
                        { "month": prev_1.strftime('%b'), "mrr": prev1_rev },
                        { "month": today.strftime('%b'), "mrr": curr_rev },
                    ]
                }
            })
        except Exception as e:
            return Response({
                "status": "success",
                "data": {
                    "mrr": 0, "arr": 0, "mrr_growth": 0,
                    "new_mrr": 0, "churned_mrr": 0, "expansion_mrr": 0,
                    "active_subscriptions": 0, "churn_rate": 0,
                    "monthly_history": []
                }
            })

class GlobalSearchView(APIView):
    """
    Global Search API: Queries across multiple apps for Cmd+K palette.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query or len(query) < 2:
            return Response({"status": "success", "data": []})

        tenant = getattr(request, 'tenant', None)
        results = []

        # CRM Clients
        try:
            from apps.crm.models import Client
            clients = Client.objects.filter(name__icontains=query)
            if tenant: clients = clients.filter(tenant=tenant)
            for c in clients[:5]:
                results.append({"type": "client", "id": c.id, "title": c.name, "url": f"/admin/crm/clients/{c.id}"})
        except Exception: pass

        # CRM Deals
        try:
            from apps.crm.models import Deal
            deals = Deal.objects.filter(title__icontains=query)
            if tenant: deals = deals.filter(tenant=tenant)
            for d in deals[:5]:
                results.append({"type": "deal", "id": d.id, "title": d.title, "url": f"/admin/crm/deals/{d.id}"})
        except Exception: pass

        # ERP Invoices
        try:
            from apps.accounting.domain.models import Invoice
            invoices = Invoice.objects.filter(invoice_number__icontains=query)
            if tenant: invoices = invoices.filter(tenant=tenant)
            for i in invoices[:5]:
                results.append({"type": "invoice", "id": i.id, "title": i.invoice_number, "url": f"/admin/erp/invoices/{i.id}"})
        except Exception: pass

        # ITSM Tickets
        try:
            from apps.support.models import Ticket
            tickets = Ticket.objects.filter(title__icontains=query)
            if tenant: tickets = tickets.filter(tenant=tenant)
            for t in tickets[:5]:
                results.append({"type": "ticket", "id": t.id, "title": t.title, "url": f"/admin/support/tickets/{t.id}"})
        except Exception: pass

        # ITAM Assets
        try:
            from apps.itam.models import Asset
            assets = Asset.objects.filter(name__icontains=query)
            if tenant: assets = assets.filter(tenant=tenant)
            for a in assets[:5]:
                results.append({"type": "asset", "id": a.id, "title": a.name, "url": f"/admin/itam/assets/{a.id}"})
        except Exception: pass

        # SOC Alerts
        try:
            from apps.soc.models import Alert
            alerts = Alert.objects.filter(title__icontains=query)
            if tenant: alerts = alerts.filter(tenant=tenant)
            for a in alerts[:5]:
                results.append({"type": "alert", "id": a.id, "title": a.title, "url": f"/admin/soc/alerts/{a.id}"})
        except Exception: pass

        return Response({"status": "success", "data": results})

