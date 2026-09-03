import logging
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {
        "erp": {"net_profit_mtd": 0, "cash_position": 0, "outstanding_ar": 0, "pending_expenses": 0},
        "mrr_history": []
    }
    try:
        from apps.accounting.domain.models import Invoice
        
        today = timezone.now().date()
        
        # ERP
        outstanding = Invoice.objects.filter(status='overdue')
        if tenant: outstanding = outstanding.filter(tenant=tenant)
        metrics["erp"]["outstanding_ar"] = float(outstanding.aggregate(t=Sum('total_amount'))['t'] or 0)
        
        # MRR history
        mrr_history = []
        for i in range(5, -1, -1):
            target_date = today - timedelta(days=30*i)
            month_label = target_date.strftime('%b')
            
            inv = Invoice.objects.filter(
                type='standard', status__in=['paid', 'sent'],
                issue_date__year=target_date.year, issue_date__month=target_date.month
            )
            if tenant:
                inv = inv.filter(tenant=tenant)
            total = float(inv.aggregate(t=Sum('total_amount'))['t'] or 0)
            mrr_history.append({"name": month_label, "mrr": total})
        metrics["mrr_history"] = mrr_history
        
    except Exception as e:
        logger.warning(f"Accounting KPI error: {e}")
    return metrics
