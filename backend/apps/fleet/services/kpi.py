import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"fleet": {"total_vehicles": 0, "active_vehicles": 0, "in_repair": 0}}
    try:
        from apps.fleet.domain.models import Vehicle
        qs = Vehicle.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        metrics["fleet"] = {
            "total_vehicles": qs.count(),
            "active_vehicles": qs.filter(state="active").count(),
            "in_repair": qs.filter(state="in_repair").count()
        }
    except Exception as e:
        logger.warning(f"Fleet KPI error: {e}")
    return metrics
