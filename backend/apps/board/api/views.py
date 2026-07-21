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
            from apps.billing.domain.models import Subscription
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
            from apps.crm.domain.models import Client
            clients = Client.objects.filter(name__icontains=query)
            if tenant: clients = clients.filter(tenant=tenant)
            for c in clients[:5]:
                results.append({"type": "client", "id": c.id, "title": c.name, "url": f"/admin/crm/clients/{c.id}"})
        except Exception: pass

        # CRM Deals
        try:
            from apps.crm.domain.models import Deal
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
            from apps.helpdesk.domain.models import Ticket
            tickets = Ticket.objects.filter(title__icontains=query)
            if tenant: tickets = tickets.filter(tenant=tenant)
            for t in tickets[:5]:
                results.append({"type": "ticket", "id": t.id, "title": t.title, "url": f"/admin/helpdesk/tickets/{t.id}"})
        except Exception: pass

        # ITAM Assets
        try:
            from apps.itam.domain.models import Asset
            assets = Asset.objects.filter(name__icontains=query)
            if tenant: assets = assets.filter(tenant=tenant)
            for a in assets[:5]:
                results.append({"type": "asset", "id": a.id, "title": a.name, "url": f"/admin/itam/maintenance/{a.id}"})
        except Exception: pass

        # SOC Alerts
        try:
            from apps.soc.domain.models import Alert
            alerts = Alert.objects.filter(title__icontains=query)
            if tenant: alerts = alerts.filter(tenant=tenant)
            for a in alerts[:5]:
                results.append({"type": "alert", "id": a.id, "title": a.title, "url": f"/admin/soc/alerts/{a.id}"})
        except Exception: pass

        return Response({"status": "success", "data": results})

class RevenueReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        import datetime
        from dateutil.relativedelta import relativedelta
        from django.utils import timezone
        
        tenant = getattr(request, 'tenant', None)
        from_date_str = request.query_params.get('from_date')
        to_date_str = request.query_params.get('to_date')
        
        # Default to last 12 months
        end_date = timezone.now()
        start_date = end_date - relativedelta(months=11)
        
        if from_date_str:
            try: start_date = timezone.datetime.fromisoformat(from_date_str).replace(tzinfo=timezone.utc)
            except: pass
        if to_date_str:
            try: end_date = timezone.datetime.fromisoformat(to_date_str).replace(tzinfo=timezone.utc)
            except: pass

        # Generate buckets
        buckets = []
        current = start_date.replace(day=1)
        while current <= end_date:
            buckets.append({
                'year': current.year,
                'month': current.month,
                'label': current.strftime('%b %Y'),
                'store_revenue': 0.0,
                'invoice_collected': 0.0,
                'total': 0.0
            })
            current += relativedelta(months=1)

        try:
            from apps.ecommerce.domain.models import Order
            orders = Order.objects.filter(status='completed', created_at__gte=start_date, created_at__lte=end_date)
            if tenant: orders = orders.filter(tenant=tenant)
            for order in orders:
                for b in buckets:
                    if b['year'] == order.created_at.year and b['month'] == order.created_at.month:
                        b['store_revenue'] += float(order.total_amount)
                        b['total'] += float(order.total_amount)
                        break
        except Exception:
            pass

        try:
            from apps.accounting.domain.models import Invoice
            invoices = Invoice.objects.filter(status='paid', issue_date__gte=start_date.date(), issue_date__lte=end_date.date())
            if tenant: invoices = invoices.filter(tenant=tenant)
            for inv in invoices:
                for b in buckets:
                    if b['year'] == inv.issue_date.year and b['month'] == inv.issue_date.month:
                        b['invoice_collected'] += float(inv.amount)
                        b['total'] += float(inv.amount)
                        break
        except Exception:
            pass
            
        monthly = [{"month": b['label'], "store_revenue": b['store_revenue'], "invoice_collected": b['invoice_collected'], "total": b['total']} for b in buckets]
        
        trend_percent = 0.0
        if len(monthly) >= 2:
            curr_tot = monthly[-1]['total']
            prev_tot = monthly[-2]['total']
            if prev_tot > 0:
                trend_percent = round(((curr_tot - prev_tot) / prev_tot) * 100, 1)

        return Response({
            "status": "success",
            "data": {
                "monthly": monthly,
                "trend_percent": trend_percent
            }
        })

class CRMReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')
        funnel = {"leads": 0, "qualified": 0, "won": 0, "win_rate": 0, "deals_open": 0, "deals_won": 0, "deals_lost": 0}
        stage_breakdown = []
        try:
            from apps.crm.domain.models import Deal, DealStage
            from django.db.models import Sum
            deals = Deal.objects.all()
            if tenant: deals = deals.filter(tenant=tenant)
            if from_date: deals = deals.filter(created_at__gte=from_date)
            if to_date: deals = deals.filter(created_at__lte=to_date)
            
            leads = deals.count()
            won = deals.filter(stage__is_won=True).count()
            lost = deals.filter(stage__is_lost=True).count()
            open_deals = deals.filter(stage__is_won=False, stage__is_lost=False).count()
            qualified = deals.filter(stage__probability__gt=50).count()
            win_rate = (won / leads * 100) if leads > 0 else 0
            
            funnel = {
                "leads": leads, 
                "qualified": qualified, 
                "won": won, 
                "win_rate": round(win_rate, 1),
                "deals_open": open_deals,
                "deals_won": won,
                "deals_lost": lost
            }
            
            stages = DealStage.objects.all()
            if tenant: stages = stages.filter(tenant=tenant)
            for stage in stages:
                stage_deals = deals.filter(stage=stage)
                count = stage_deals.count()
                total_val = float(stage_deals.aggregate(tot=Sum('expected_revenue'))['tot'] or 0)
                stage_breakdown.append({
                    "stage": stage.name,
                    "count": count,
                    "total_value": total_val,
                    "is_won": stage.is_won,
                    "is_lost": stage.is_lost
                })
                
        except Exception:
            pass

        return Response({
            "status": "success",
            "data": {
                "funnel": funnel,
                "stage_breakdown": stage_breakdown
            }
        })

class SupportReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')
        support_data = {
            "open": 0, "closed_this_week": 0, "avg_resolution_time_hrs": 0,
            "total_tickets": 0, "resolved_tickets": 0, "sla_compliance_rate": 0,
            "tickets_by_priority": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "avg_resolution_hours": 0
        }
        try:
            from apps.helpdesk.domain.models import Ticket
            from django.utils import timezone
            from datetime import timedelta
            
            tickets = Ticket.objects.all()
            if tenant: tickets = tickets.filter(tenant=tenant)
            if from_date: tickets = tickets.filter(created_at__gte=from_date)
            if to_date: tickets = tickets.filter(created_at__lte=to_date)
            
            open_t = tickets.filter(status__in=['open', 'in_progress']).count()
            resolved_qs = tickets.filter(status='resolved')
            closed_t = resolved_qs.count()
            
            # closed_this_week
            seven_days_ago = timezone.now() - timedelta(days=7)
            closed_this_week = resolved_qs.filter(resolved_at__gte=seven_days_ago).count()
            
            # Priority breakdown
            tickets_by_priority = {
                "critical": tickets.filter(priority='critical').count(),
                "high": tickets.filter(priority='high').count(),
                "medium": tickets.filter(priority='medium').count(),
                "low": tickets.filter(priority='low').count()
            }
            
            # SLA & Avg resolution
            total_res_hours = 0
            sla_met_count = 0
            for t in resolved_qs:
                if t.resolved_at and t.created_at:
                    hours = (t.resolved_at - t.created_at).total_seconds() / 3600.0
                    total_res_hours += hours
                    if hours <= 48:
                        sla_met_count += 1
                        
            avg_res_hrs = round(total_res_hours / closed_t, 1) if closed_t > 0 else 0
            sla_rate = round((sla_met_count / closed_t * 100), 1) if closed_t > 0 else 100
            
            support_data = {
                "open": open_t,
                "closed_this_week": closed_this_week,
                "avg_resolution_time_hrs": avg_res_hrs,
                "total_tickets": tickets.count(),
                "resolved_tickets": closed_t,
                "sla_compliance_rate": sla_rate,
                "tickets_by_priority": tickets_by_priority,
                "avg_resolution_hours": avg_res_hrs
            }
        except Exception:
            pass
            
        return Response({
            "status": "success",
            "data": support_data
        })

class SecurityReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')
        security_data = {
            "open_alerts": 0, "critical": 0, "high": 0,
            "total_alerts": 0, "resolved_incidents": 0, "endpoints_monitored": 0,
            "threat_score": 0, "alerts_by_severity": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "open_incidents": 0
        }
        try:
            from apps.soc.domain.models import Alert
            try:
                from apps.soc.domain.models import Endpoint
            except ImportError:
                Endpoint = None
                
            alerts = Alert.objects.all()
            if tenant: alerts = alerts.filter(tenant=tenant)
            if from_date: alerts = alerts.filter(created_at__gte=from_date)
            if to_date: alerts = alerts.filter(created_at__lte=to_date)
            
            open_alerts = alerts.filter(is_resolved=False)
            resolved = alerts.filter(is_resolved=True)
            
            critical_cnt = open_alerts.filter(severity='critical').count()
            high_cnt = open_alerts.filter(severity='high').count()
            medium_cnt = open_alerts.filter(severity='medium').count()
            low_cnt = open_alerts.filter(severity='low').count()
            
            endpoints_cnt = Endpoint.objects.filter(tenant=tenant).count() if Endpoint and tenant else (Endpoint.objects.count() if Endpoint else 0)
            
            score = (critical_cnt * 10) + (high_cnt * 5) + (medium_cnt * 2) + (low_cnt * 1)
            threat_score = min(score, 100)
            
            security_data = {
                "open_alerts": open_alerts.count(),
                "critical": critical_cnt,
                "high": high_cnt,
                "total_alerts": alerts.count(),
                "resolved_incidents": resolved.count(),
                "endpoints_monitored": endpoints_cnt,
                "threat_score": threat_score,
                "alerts_by_severity": {
                    "critical": critical_cnt,
                    "high": high_cnt,
                    "medium": medium_cnt,
                    "low": low_cnt
                },
                "open_incidents": critical_cnt + high_cnt
            }
        except Exception:
            pass

        return Response({
            "status": "success",
            "data": security_data
        })

class ExportReportView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, type):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{type}_export.csv"'
        writer = csv.writer(response)
        
        tenant = getattr(request, 'tenant', None)
        
        if type == 'revenue':
            writer.writerow(['Type', 'Amount'])
            try:
                from apps.ecommerce.domain.models import Order
                from django.db.models import Sum
                orders = Order.objects.all()
                if tenant: orders = orders.filter(tenant=tenant)
                store_rev = float(orders.filter(status='completed').aggregate(total=Sum('total_amount'))['total'] or 0)
                writer.writerow(['Store Revenue', store_rev])
            except Exception:
                pass
                
        elif type == 'crm':
            writer.writerow(['Metric', 'Value'])
            try:
                from apps.crm.domain.models import Deal
                deals = Deal.objects.all()
                if tenant: deals = deals.filter(tenant=tenant)
                writer.writerow(['Total Deals', deals.count()])
                writer.writerow(['Won Deals', deals.filter(stage__is_won=True).count()])
            except Exception:
                pass
                
        elif type == 'support':
            writer.writerow(['Status', 'Count'])
            try:
                from apps.helpdesk.domain.models import Ticket
                tickets = Ticket.objects.all()
                if tenant: tickets = tickets.filter(tenant=tenant)
                writer.writerow(['Open Tickets', tickets.filter(status__in=['open', 'in_progress']).count()])
                writer.writerow(['Resolved Tickets', tickets.filter(status='resolved').count()])
            except Exception:
                pass
                
        elif type == 'security':
            writer.writerow(['Severity', 'Count'])
            try:
                from apps.soc.domain.models import Alert
                alerts = Alert.objects.filter(is_resolved=False)
                if tenant: alerts = alerts.filter(tenant=tenant)
                writer.writerow(['Critical', alerts.filter(severity='critical').count()])
                writer.writerow(['High', alerts.filter(severity='high').count()])
            except Exception:
                pass
                
        elif type == 'hrm':
            writer.writerow(['Metric', 'Value'])
            try:
                from apps.hr.domain.models import Employee
                employees = Employee.objects.all()
                if tenant: employees = employees.filter(tenant=tenant)
                writer.writerow(['Total Employees', employees.count()])
                writer.writerow(['Active Employees', employees.filter(status='active').count()])
            except Exception:
                pass
                
        elif type == 'invoices':
            writer.writerow(['Invoice Number', 'Amount', 'Status', 'Date'])
            try:
                from apps.accounting.domain.models import Invoice
                invoices = Invoice.objects.all().order_by('-issue_date')
                if tenant: invoices = invoices.filter(tenant=tenant)
                for inv in invoices[:1000]: # limit to avoid huge exports
                    writer.writerow([inv.invoice_number, inv.amount, inv.status, inv.issue_date])
            except Exception:
                pass
                
        return response
