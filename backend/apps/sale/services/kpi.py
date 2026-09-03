import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"sales": {"orders": 0}}
    try:
        from apps.sale.domain.models import SaleOrder
        orders = SaleOrder.objects.filter(status='sale')
        if tenant:
            orders = orders.filter(tenant=tenant)
        metrics["sales"]["orders"] = orders.count()
    except Exception as e:
        logger.warning(f"Sales KPI error: {e}")
    return metrics
