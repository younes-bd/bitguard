import logging
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"projects": {"active_projects": 0, "overdue_tasks": 0, "missing_timesheets": 0}}
    try:
        from apps.projects.domain.models import Project, Task
        from django.utils import timezone
        
        projs = Project.objects.filter(status='in_progress')
        tasks = Task.objects.filter(status__in=['todo', 'in_progress'], due_date__lt=timezone.now().date())
        if tenant:
            projs = projs.filter(tenant=tenant)
            tasks = tasks.filter(project__tenant=tenant)
            
        metrics["projects"] = {
            "active_projects": projs.count(),
            "overdue_tasks": tasks.count(),
            "missing_timesheets": 0
        }
    except Exception as e:
        logger.warning(f"Projects KPI error: {e}")
    return metrics
