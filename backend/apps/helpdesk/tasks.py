from celery import shared_task
from apps.helpdesk.domain.models import Ticket

@shared_task
def check_sla_breaches():
    """
    Periodic task to find tickets that have exceeded their due date
    and have not yet been marked as a breach.
    """
    Ticket.escalate_sla_breaches()
    return "SLA breaches checked and escalated."
