from django.db.models import Sum, Count, Avg, F
from django.utils import timezone
from datetime import timedelta


class ReportService:
    """
    BFF-style aggregation service for cross-module reports.
    Reads from other module models — owns no tables.
    All methods accept an optional tenant for scoped reports.
    """

    # ── Revenue Report ────────────────────────────────────────────────────
    @classmethod
    def get_revenue_report(cls, tenant=None):
        from apps.store.models import Order
        from apps.erp.models import Invoice, Payment

        now = timezone.now()
        months = []
        for i in range(11, -1, -1):
            start = (now.replace(day=1) - timedelta(days=i * 30)).replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            end = (start + timedelta(days=32)).replace(day=1)
            label = start.strftime('%b %Y')

            orders = Order.objects.filter(status='completed', created_at__gte=start, created_at__lt=end)
            payments = Payment.objects.filter(created_at__gte=start, created_at__lt=end)
            if tenant:
                orders = orders.filter(tenant=tenant)
                payments = payments.filter(tenant=tenant)

            months.append({
                'month': label,
                'store_revenue': float(orders.aggregate(t=Sum('total_amount'))['t'] or 0),
                'invoice_collected': float(payments.aggregate(t=Sum('amount'))['t'] or 0),
            })

        # Top products by revenue
        try:
            top_products = list(
                Order.objects.filter(status='completed')
                .values('items__product__name')
                .annotate(total=Sum('items__price'))
                .order_by('-total')[:10]
            )
        except Exception:
            top_products = []

        return {'monthly': months, 'top_products': top_products}

    # ── CRM / Sales Report ────────────────────────────────────────────────
    @classmethod
    def get_crm_report(cls, tenant=None):
        from apps.crm.models import Lead, Deal, Client

        leads = Lead.objects.all()
        deals = Deal.objects.all()
        clients = Client.objects.all()
        if tenant:
            leads = leads.filter(tenant=tenant)
            deals = deals.filter(tenant=tenant)
            clients = clients.filter(tenant=tenant)

        total_deals = deals.count()
        won_deals = deals.filter(stage='won').count()

        funnel = {
            'leads': leads.count(),
            'deals_open': deals.filter(stage__in=['discovery', 'proposal', 'negotiation']).count(),
            'deals_won': won_deals,
            'deals_lost': deals.filter(stage='lost').count(),
            'win_rate': round(won_deals / total_deals * 100, 1) if total_deals else 0,
        }

        stage_breakdown = list(
            deals.values('stage').annotate(count=Count('id'), total_value=Sum('amount'))
        )

        return {'funnel': funnel, 'stage_breakdown': stage_breakdown}

    # ── Support Report ────────────────────────────────────────────────────
    @classmethod
    def get_support_report(cls, tenant=None):
        from apps.support.models import Ticket

        tickets = Ticket.objects.all()
        if tenant:
            tickets = tickets.filter(tenant=tenant)

        by_status = list(tickets.values('status').annotate(count=Count('id')))
        by_priority = list(tickets.values('priority').annotate(count=Count('id')))

        resolved = tickets.filter(status='resolved')
        avg_resolution = resolved.aggregate(
            avg=Avg(F('updated_at') - F('created_at'))
        )['avg']

        return {
            'by_status': by_status,
            'by_priority': by_priority,
            'total': tickets.count(),
            'open': tickets.filter(status__in=['open', 'in_progress']).count(),
            'resolved': resolved.count(),
            'avg_resolution_hours': round(avg_resolution.total_seconds() / 3600, 1) if avg_resolution else None,
        }

    # ── Security Report ───────────────────────────────────────────────────
    @classmethod
    def get_security_report(cls, tenant=None):
        from apps.soc.models import Alert, Incident

        alerts = Alert.objects.all()
        incidents = Incident.objects.all()
        if tenant:
            alerts = alerts.filter(tenant=tenant)
            incidents = incidents.filter(tenant=tenant)

        by_severity = list(alerts.values('severity').annotate(count=Count('id')))
        incident_trend = list(
            incidents.values('status').annotate(count=Count('id'))
        )

        return {
            'total_alerts': alerts.count(),
            'open_alerts': alerts.filter(is_resolved=False).count(),
            'by_severity': by_severity,
            'total_incidents': incidents.count(),
            'incident_by_status': incident_trend,
            'mttr_hours': None,  # Mean time to resolve — placeholder for future calculation
        }
