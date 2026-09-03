import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"quality_control": {"total_alerts": 0, "open_alerts": 0}}
    try:
        from apps.quality_control.domain.models import QualityAlert
        qs = QualityAlert.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        metrics["quality_control"] = {
            "total_alerts": qs.count(),
            "open_alerts": qs.filter(state__in=["draft", "in_progress"]).count()
        }
    except Exception as e:
        logger.warning(f"Quality KPI error: {e}")
    return metrics
