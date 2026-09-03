import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"hr": {"total_employees": 0, "on_leave": 0, "attrition_rate": 0.0}}
    try:
        from apps.hr.domain.models import Employee
        qs = Employee.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        total = qs.count()
        metrics["hr"] = {
            "total_employees": total,
            "on_leave": qs.filter(status='on_leave').count() if hasattr(Employee, 'status') else 0,
            "attrition_rate": 0.0
        }
    except Exception as e:
        logger.warning(f"HR KPI error: {e}")
    return metrics
