import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"mrp": {"total_orders": 0, "done_orders": 0, "in_progress": 0, "open_orders": 0}}
    try:
        from apps.mrp.domain.models import ManufacturingOrder
        qs = ManufacturingOrder.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        metrics["mrp"] = {
            "total_orders": qs.count(),
            "done_orders": qs.filter(state="done").count(),
            "in_progress": qs.filter(state="in_progress").count(),
            "open_orders": qs.filter(state__in=["draft", "confirmed", "in_progress"]).count()
        }
    except Exception as e:
        logger.warning(f"MRP KPI error: {e}")
    return metrics
