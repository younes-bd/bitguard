import logging
from django.db.models import Sum
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"crm": {"total_leads": 0, "open_deals": 0, "win_rate": 0, "pipeline_value": 0}}
    try:
        from apps.crm.domain.models import Deal
        deals = Deal.objects.all()
        if tenant:
            deals = deals.filter(tenant=tenant)
        metrics["crm"] = {
            "total_leads": deals.count(),
            "open_deals": deals.filter(stage__is_won=False).count(),
            "win_rate": 0,
            "pipeline_value": float(deals.filter(stage__is_won=False).aggregate(t=Sum('amount'))['t'] or 0)
        }
    except Exception as e:
        logger.warning(f"CRM KPI error: {e}")
    return metrics
