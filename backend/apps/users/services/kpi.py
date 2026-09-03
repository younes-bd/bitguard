from django.contrib.auth import get_user_model
import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"users": {"total": 0, "active": 0, "mfa_enabled": 0}}
    try:
        User = get_user_model()
        qs = User.objects.all()
        if tenant:
            qs = qs.filter(tenant_memberships__tenant=tenant, tenant_memberships__is_active=True)
        metrics["users"] = {
            "total": qs.count(),
            "active": qs.filter(is_active=True).count(),
            "mfa_enabled": qs.filter(mfa_enabled=True).count() if hasattr(User, 'mfa_enabled') else 0
        }
    except Exception as e:
        logger.warning(f"Users KPI error: {e}")
    return metrics
