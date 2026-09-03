import logging
from django.db.models import Sum
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"ecommerce": {"store_revenue": 0, "total_orders": 0, "avg_order_value": 0}}
    try:
        from apps.ecommerce.domain.models import Order
        orders = Order.objects.filter(status='completed')
        if tenant:
            orders = orders.filter(tenant=tenant)
        total = float(orders.aggregate(t=Sum('total_amount'))['t'] or 0)
        count = orders.count()
        metrics["ecommerce"] = {
            "store_revenue": total,
            "total_orders": count,
            "avg_order_value": total / count if count > 0 else 0
        }
    except Exception as e:
        logger.warning(f"Ecommerce KPI error: {e}")
    return metrics
