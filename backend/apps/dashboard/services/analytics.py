from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta


class CommandCenterAnalyticsService:
    @classmethod
    def get_global_metrics(cls, tenant=None):
        """
        Gathers high-level KPIs across all 9 deployed modules for the BFF
        Command Center. Tenant-scoped when tenant is provided.
        """
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

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
        except Exception:
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
        except Exception:
            metrics["store"] = {"lifetime_revenue": 0.0, "monthly_revenue": 0.0, "pending_orders": 0, "total_orders": 0}

        # ── 3. ERP / Finance ──────────────────────────────────────────────────
        try:
            from apps.erp.models import Invoice, Payment
            invoices = Invoice.objects.all()
            payments = Payment.objects.all()
            if tenant:
                invoices = invoices.filter(tenant=tenant)
                payments = payments.filter(tenant=tenant)
            metrics["erp"] = {
                "overdue_invoices": invoices.filter(status="overdue").count(),
                "open_invoices": invoices.filter(status="unpaid").count(),
                "monthly_collected": float(
                    payments.filter(created_at__gte=thirty_days_ago)
                    .aggregate(total=Sum("amount"))["total"] or 0
                ),
            }
        except Exception:
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
        except Exception:
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
        except Exception:
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
        except Exception:
            metrics["security"] = {
                "open_alerts": 0, "critical_alerts": 0,
                "open_incidents": 0, "managed_endpoints": 0, "at_risk_endpoints": 0,
            }

        # ── 7. HRM ────────────────────────────────────────────────────────────
        try:
            from apps.hrm.models import Employee, LeaveRequest
            employees = Employee.objects.all()
            leaves = LeaveRequest.objects.all()
            if tenant:
                employees = employees.filter(tenant=tenant)
                leaves = leaves.filter(tenant=tenant)
            metrics["hrm"] = {
                "headcount": employees.filter(status="active").count(),
                "pending_leaves": leaves.filter(status="pending").count(),
            }
        except Exception:
            metrics["hrm"] = {"headcount": 0, "pending_leaves": 0}

        # ── 8. SCM ────────────────────────────────────────────────────────────
        try:
            from apps.scm.models import PurchaseOrder, InventoryItem
            pos = PurchaseOrder.objects.all()
            items = InventoryItem.objects.all()
            if tenant:
                pos = pos.filter(tenant=tenant)
                items = items.filter(tenant=tenant)
            metrics["scm"] = {
                "pending_orders": pos.filter(status__in=["draft", "sent"]).count(),
                "low_stock_items": items.filter(quantity_on_hand__lte=10).count(),
                "total_vendors": pos.values("vendor").distinct().count(),
            }
        except Exception:
            metrics["scm"] = {"pending_orders": 0, "low_stock_items": 0, "total_vendors": 0}

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
                "sla_breaches": breaches.filter(resolved=False).count(),
            }
        except Exception:
            metrics["contracts"] = {"active_contracts": 0, "expiring_soon": 0, "sla_breaches": 0}

        return metrics
