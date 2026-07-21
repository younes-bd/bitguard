from celery import shared_task
from django.utils import timezone
from apps.helpdesk.domain.models import Ticket
from apps.contracts.domain.models import SLABreach, ServiceContract
from apps.notifications.domain.models import Notification

@shared_task
def check_sla_breaches():
    """
    Periodic task to find tickets that have exceeded their due date
    and have not yet been marked as a breach.
    """
    now = timezone.now()
    
    # Find open/in_progress tickets that are past due
    breached_tickets = Ticket.objects.filter(
        status__in=['open', 'in_progress'],
        due_date__lt=now
    )
    
    for ticket in breached_tickets:
        # Avoid creating duplicate breaches for the same ticket/resolution type
        if SLABreach.objects.filter(ticket_id=ticket.id, breach_type='resolution').exists():
            continue
            
        # For simplicity, we assume there is one default service contract per client
        # In a real scenario, this would be tied to the specific service the ticket is about.
        if ticket.client:
            contract = ServiceContract.objects.filter(client=ticket.client, status='active').first()
            if contract:
                # Create the SLA Breach record
                breach = SLABreach.objects.create(
                    contract=contract,
                    ticket_id=ticket.id,
                    breach_type='resolution',
                    breached_at=now
                )
                
                # Notify the assigned agent or tenant admins
                user_to_notify = ticket.assigned_to or ticket.created_by
                if user_to_notify:
                    Notification.objects.create(
                        tenant=ticket.tenant,
                        user=user_to_notify,
                        type='system',
                        title='SLA Breach Detected',
                        message=f'Ticket "{ticket.title}" has exceeded its resolution SLA.',
                    )
