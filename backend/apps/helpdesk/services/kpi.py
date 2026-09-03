import logging
from django.utils import timezone
from datetime import timedelta
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {
        "helpdesk": {"open_tickets": 0, "avg_resolution_time": "0h", "sla_breaches": 0},
        "support_burndown": [],
        "needs_attention": {"unpaid_invoices": 0, "sla_breaches": 0, "overdue_tasks": 0}
    }
    try:
        from apps.helpdesk.domain.models import Ticket, SLABreach
        from apps.projects.domain.models import Task
        from apps.accounting.domain.models import Invoice
        
        today = timezone.now().date()
        tickets = Ticket.objects.exclude(status='closed')
        breaches = SLABreach.objects.filter(acknowledged=False)
        tasks = Task.objects.filter(due_date__lt=today, status__in=['todo', 'in_progress'])
        invoices = Invoice.objects.filter(status='overdue')
        
        if tenant:
            tickets = tickets.filter(tenant=tenant)
            breaches = breaches.filter(tenant=tenant)
            tasks = tasks.filter(project__tenant=tenant)
            invoices = invoices.filter(tenant=tenant)
            
        metrics["helpdesk"]["open_tickets"] = tickets.count()
        metrics["helpdesk"]["sla_breaches"] = breaches.count()
        
        metrics["needs_attention"]["unpaid_invoices"] = invoices.count()
        metrics["needs_attention"]["sla_breaches"] = breaches.count()
        metrics["needs_attention"]["overdue_tasks"] = tasks.count()
        
        # Burndown
        burndown = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_label = day.strftime('%a')
            
            t = Ticket.objects.all()
            if tenant: t = t.filter(tenant=tenant)
            
            opened = t.filter(created_at__date=day).count()
            resolved = t.filter(status='resolved', resolved_at__date=day).count()
            burndown.append({"day": day_label, "opened": opened, "resolved": resolved})
            
        metrics["support_burndown"] = burndown
        
    except Exception as e:
        logger.warning(f"Helpdesk KPI error: {e}")
    return metrics
