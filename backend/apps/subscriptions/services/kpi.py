import logging
from django.db.models import Sum
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"subscriptions": {"active_subscriptions": 0, "mrr": 0, "arr": 0, "churn_rate": 0}}
    try:
        from apps.subscriptions.domain.models import Subscription
        qs = Subscription.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
            
        active = qs.filter(status='active')
        mrr = float(active.aggregate(t=Sum('plan__price_monthly'))['t'] or 0)
        
        metrics["subscriptions"] = {
            "active_subscriptions": active.count(),
            "mrr": mrr,
            "arr": mrr * 12,
            "churn_rate": 0
        }
    except Exception as e:
        logger.warning(f"Subscriptions KPI error: {e}")
    return metrics
