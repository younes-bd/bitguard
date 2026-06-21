from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


class CommandCenterAnalyticsService:
    @classmethod
    def get_global_metrics(cls, tenant=None, date_range='30days'):
        """
        Gathers high-level KPIs across all 9 deployed modules for the BFF
        Command Center. Tenant-scoped when tenant is provided.
        """
        now = timezone.now()
        today = now.date()
        
        if date_range == '7days':
            past_date = now - timedelta(days=7)
        elif date_range == '90days':
            past_date = now - timedelta(days=90)
        elif date_range == 'thisYear':
            past_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            past_date = now - timedelta(days=30)
            
        thirty_days_ago = past_date # Keep the variable name to avoid renaming it everywhere

        metrics = {}

        # ── 1. CRM ────────────────────────────────────────────────────────────
        try:
            from apps.crm.models import Client, Deal
            clients = Client.objects.all()
            deals = Deal.objects.all()
            if tenant:
                clients = clients.filter(tenant=tenant)
                deals = deals.filter(tenant=tenant)
            metrics["crm"] = {
                "active_clients": clients.filter(status="active").count(),
                "total_clients": clients.count(),
                "recent_revenue": float(
                    deals.filter(stage="won", updated_at__gte=thirty_days_ago)
                    .aggregate(total=Sum("amount"))["total"] or 0
                ),
                "open_deals": deals.filter(stage__in=["discovery", "proposal", "negotiation"]).count(),
            }
        except Exception as e:
            logger.warning(f"CRM analytics error: {e}")
            metrics["crm"] = {"active_clients": 0, "total_clients": 0, "recent_revenue": 0.0, "open_deals": 0}

        # ── 2. Commerce / Store ───────────────────────────────────────────────
        try:
            from apps.store.models import Order
            orders = Order.objects.all()
            if tenant:
                orders = orders.filter(tenant=tenant)
            metrics["store"] = {
                "lifetime_revenue": float(
                    orders.filter(status="completed").aggregate(total=Sum("total_amount"))["total"] or 0
                ),
                "monthly_revenue": float(
                    orders.filter(status="completed", created_at__gte=thirty_days_ago)
                    .aggregate(total=Sum("total_amount"))["total"] or 0
                ),
                "pending_orders": orders.filter(status__in=["pending", "processing"]).count(),
                "total_orders": orders.count(),
            }
        except Exception as e:
            logger.warning(f"Store analytics error: {e}")
            metrics["store"] = {"lifetime_revenue": 0.0, "monthly_revenue": 0.0, "pending_orders": 0, "total_orders": 0}

        # ── 3. ERP / Finance ──────────────────────────────────────────────────
        try:
            from apps.accounting.domain.models import Invoice, Payment
            invoices = Invoice.objects.all()
            payments = Payment.objects.all()
            if tenant:
                invoices = invoices.filter(tenant=tenant)
                payments = payments.filter(tenant=tenant)
            metrics["erp"] = {
                "overdue_invoices": invoices.filter(status="overdue").count(),
                "open_invoices": invoices.filter(status__in=["draft", "sent"]).count(),
                "monthly_collected": float(
                    payments.filter(payment_date__gte=thirty_days_ago.date())
                    .aggregate(total=Sum("amount"))["total"] or 0
                ),
            }
        except Exception as e:
            logger.warning(f"ERP analytics error: {e}")
            metrics["erp"] = {"overdue_invoices": 0, "open_invoices": 0, "monthly_collected": 0.0}

        # ── 4. Support / Help Desk ────────────────────────────────────────────
        try:
            from apps.support.models import Ticket
            tickets = Ticket.objects.all()
            if tenant:
                tickets = tickets.filter(tenant=tenant)
            metrics["support"] = {
                "open_tickets": tickets.filter(status__in=["open", "in_progress"]).count(),
                "critical_tickets": tickets.filter(priority="critical", status__in=["open", "in_progress"]).count(),
                "resolved_today": tickets.filter(
                    status="resolved", updated_at__date=now.date()
                ).count(),
            }
        except Exception as e:
            logger.warning(f"Support analytics error: {e}")
            metrics["support"] = {"open_tickets": 0, "critical_tickets": 0, "resolved_today": 0}

        # ── 5. Marketing ──────────────────────────────────────────────────────
        try:
            from apps.marketing.models import Campaign
            campaigns = Campaign.objects.all()
            if tenant:
                campaigns = campaigns.filter(tenant=tenant)
            metrics["marketing"] = {
                "active_campaigns": campaigns.filter(status="active").count(),
                "total_campaigns": campaigns.count(),
            }
        except Exception as e:
            logger.warning(f"Marketing analytics error: {e}")
            metrics["marketing"] = {"active_campaigns": 0, "total_campaigns": 0}

        # ── 6. Security (SOC) ─────────────────────────────────────────────────
        try:
            from apps.soc.models import Alert, Incident, ManagedEndpoint
            alerts = Alert.objects.all()
            incidents = Incident.objects.all()
            endpoints = ManagedEndpoint.objects.all()
            if tenant:
                alerts = alerts.filter(tenant=tenant)
                incidents = incidents.filter(tenant=tenant)
                endpoints = endpoints.filter(workspace__tenant=tenant)
            metrics["security"] = {
                "open_alerts": alerts.filter(is_resolved=False).count(),
                "critical_alerts": alerts.filter(is_resolved=False, severity="critical").count(),
                "open_incidents": incidents.filter(status__in=["open", "investigating", "contained"]).count(),
                "managed_endpoints": endpoints.filter(status="online").count(),
                "at_risk_endpoints": endpoints.filter(status="at_risk").count(),
            }
        except Exception as e:
            logger.warning(f"Security analytics error: {e}")
            metrics["security"] = {
                "open_alerts": 0, "critical_alerts": 0,
                "open_incidents": 0, "managed_endpoints": 0, "at_risk_endpoints": 0,
            }

        # ── 7. HRM ────────────────────────────────────────────────────────────
        try:
            from apps.hrm.models import Employee, LeaveRequest, Certification
            employees = Employee.objects.all()
            leaves = LeaveRequest.objects.all()
            certs = Certification.objects.filter(is_active=True, expiry_date__lte=today + timedelta(days=60))
            if tenant:
                employees = employees.filter(tenant=tenant)
                leaves = leaves.filter(tenant=tenant)
                certs = certs.filter(tenant=tenant)
            metrics["hrm"] = {
                "headcount": employees.filter(status="active").count(),
                "pending_leaves": leaves.filter(status="pending").count(),
                "expiring_certifications": certs.count(),
            }
        except Exception as e:
            logger.warning(f"HRM analytics error: {e}")
            metrics["hrm"] = {"headcount": 0, "pending_leaves": 0}

        # ── 8. SCM ────────────────────────────────────────────────────────────
        try:
            metrics["purchase"] = {
                "pending_orders": apps.get_model('purchase', 'PurchaseOrder').objects.filter(
                    tenant=tenant, status='pending'
                ).count(),
                "total_vendors": apps.get_model('purchase', 'Vendor').objects.filter(
                    tenant=tenant
                ).count()
            }
            metrics["inventory"] = {
                "low_stock_items": apps.get_model('inventory', 'InventoryItem').objects.filter(
                    tenant=tenant, quantity_on_hand__lt=models.F('reorder_level')
                ).count()
            }
        except Exception as e:
            logger.warning(f"SCM analytics error: {e}")
            metrics["purchase"] = {"pending_orders": 0, "total_vendors": 0}
            metrics["inventory"] = {"low_stock_items": 0}

        # ── 9. Contracts & SLA ────────────────────────────────────────────────
        try:
            from apps.contracts.models import ServiceContract, SLABreach
            contracts = ServiceContract.objects.all()
            breaches = SLABreach.objects.all()
            if tenant:
                contracts = contracts.filter(tenant=tenant)
                breaches = breaches.filter(tenant=tenant)
            metrics["contracts"] = {
                "active_contracts": contracts.filter(status="active").count(),
                "expiring_soon": contracts.filter(
                    status="active", end_date__lte=now + timedelta(days=30)
                ).count(),
                "sla_breaches": breaches.filter(acknowledged=False).count(),
            }
        except Exception as e:
            logger.warning(f"Contracts analytics error: {e}")
            metrics["contracts"] = {"active_contracts": 0, "expiring_soon": 0, "sla_breaches": 0}

        # ── 10. Projects / PSA ─────────────────────────────────────────────────
        try:
            from apps.projects.models import Project, Task
            projects = Project.objects.all()
            tasks = Task.objects.all()
            if tenant:
                projects = projects.filter(tenant=tenant)
                tasks = tasks.filter(tenant=tenant)
            metrics["projects"] = {
                "active_projects": projects.filter(status__in=["active", "planning"]).count(),
                "at_risk": projects.filter(status="on_hold").count(),
                "total_projects": projects.count(),
                "overdue_tasks": tasks.filter(
                    status__in=["todo", "in_progress"],
                    due_date__lt=now.date()
                ).count(),
            }
        except Exception as e:
            logger.warning(f"Projects analytics error: {e}")
            metrics["projects"] = {"active_projects": 0, "at_risk": 0, "total_projects": 0, "overdue_tasks": 0}

        # ── 11. ITAM (IT Asset Management) ─────────────────────────────────────
        try:
            from apps.itam.models import Asset, SoftwareLicense
            assets = Asset.objects.all()
            licenses = SoftwareLicense.objects.filter(is_active=True, expiry_date__lte=today + timedelta(days=30))
            if tenant:
                assets = assets.filter(tenant=tenant)
                licenses = licenses.filter(tenant=tenant)
            metrics["itam"] = {
                "total_assets": assets.count(),
                "active_assets": assets.filter(status="active").count() if hasattr(Asset, 'status') else assets.count(),
                "expiring_licenses": licenses.count(),
            }
        except Exception as e:
            logger.warning(f"ITAM analytics error: {e}")
            metrics["itam"] = {"total_assets": 0, "active_assets": 0}

        # ── 12. Approvals ──────────────────────────────────────────────────────
        try:
            from apps.approvals.models import ApprovalRequest
            approvals = ApprovalRequest.objects.all()
            if tenant:
                approvals = approvals.filter(tenant=tenant)
            metrics["approvals"] = {
                "pending": approvals.filter(status="pending").count(),
                "approved_today": approvals.filter(
                    status="approved", decided_at__date=now.date()
                ).count(),
                "total": approvals.count(),
            }
        except Exception as e:
            logger.warning(f"Approvals analytics error: {e}")
            metrics["approvals"] = {"pending": 0, "approved_today": 0, "total": 0}

        # ── 13. ITSM (Change Management) ───────────────────────────────────────
        try:
            from apps.itsm.models import ChangeRequest
            changes = ChangeRequest.objects.all()
            if tenant:
                changes = changes.filter(tenant=tenant)
            metrics["itsm"] = {
                "open_changes": changes.filter(status__in=["draft", "submitted", "in_progress"]).count(),
                "high_risk": changes.filter(risk_level="high", status__in=["draft", "submitted"]).count(),
                "completed": changes.filter(status="completed").count(),
            }
        except Exception as e:
            logger.warning(f"ITSM analytics error: {e}")
            metrics["itsm"] = {"open_changes": 0, "high_risk": 0, "completed": 0}

        # ── 14. Documents ──────────────────────────────────────────────────────
        try:
            from apps.edms.domain.models import Document
            docs = Document.objects.all()
            if tenant:
                docs = docs.filter(tenant=tenant)
            metrics["documents"] = {
                "total": docs.count(),
                "archived": docs.filter(is_archived=True).count(),
                "expiring_soon": docs.filter(expiry_date__lte=today + timedelta(days=7)).count() if hasattr(Document, 'expiry_date') else 0,
            }
        except Exception as e:
            logger.warning(f"Documents analytics error: {e}")
            metrics["documents"] = {"total": 0, "archived": 0}

        # ── 15. Billing ────────────────────────────────────────────────────────
        try:
            from apps.billing.models import Subscription
            subs = Subscription.objects.all()
            if tenant:
                subs = subs.filter(tenant=tenant)
            
            metrics["billing"] = {
                "active_subscriptions": subs.filter(status="active").count(),
                "mrr": float(subs.filter(status="active").aggregate(total=Sum("plan__price_monthly"))["total"] or 0),
            }
        except Exception as e:
            logger.warning(f"Billing analytics error: {e}")
            metrics["billing"] = {"active_subscriptions": 0, "mrr": 0.0}

        # ── Global Executive Metrics (MRR/ARR/Headcount) ─────────────────────
        try:
            mrr = metrics.get("billing", {}).get("mrr", 0.0)
            arr = mrr * 12
            headcount = metrics.get("hrm", {}).get("headcount", 0)
            metrics["executive"] = {
                "mrr": mrr,
                "arr": arr,
                "headcount": headcount,
            }
        except Exception as e:
            logger.warning(f"Executive analytics error: {e}")
            metrics["executive"] = {"mrr": 0.0, "arr": 0.0, "headcount": 0}

        # ── Needs Attention (Alerts) ──────────────────────────────────────────
        try:
            from apps.contracts.models import SLABreach
            from apps.accounting.domain.models import Invoice
            from apps.projects.models import Task
            
            unpaid_invoices = Invoice.objects.filter(status='overdue')
            unacknowledged_breaches = SLABreach.objects.filter(acknowledged=False)
            overdue_tasks = Task.objects.filter(due_date__lt=now.date(), status__in=['todo', 'in_progress'])
            
            if tenant:
                unpaid_invoices = unpaid_invoices.filter(tenant=tenant)
                unacknowledged_breaches = unacknowledged_breaches.filter(tenant=tenant)
                overdue_tasks = overdue_tasks.filter(tenant=tenant)
            
            metrics["needs_attention"] = {
                "unpaid_invoices": unpaid_invoices.count(),
                "sla_breaches": unacknowledged_breaches.count(),
                "overdue_tasks": overdue_tasks.count(),
            }
        except Exception as e:
            logger.warning(f"Needs Attention analytics error: {e}")
            metrics["needs_attention"] = {"unpaid_invoices": 0, "sla_breaches": 0, "overdue_tasks": 0}

        return metrics
