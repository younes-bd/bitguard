from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.support.models import Ticket
from integrations.ai_engine.services import AiEngineService
from apps.core.services.audit import AuditService

class _SystemRequest:
    """Minimal request-like object for signals that run outside an HTTP request."""
    class _AnonUser:
        is_authenticated = False
        pk = None

    def __init__(self, user=None):
        self.user = user if user is not None else self._AnonUser()
        self.META = {'REMOTE_ADDR': '127.0.0.1'}
        self.tenant = getattr(user, 'tenant', None) if user else None

@receiver(post_save, sender=Ticket)
def trigger_ai_triage(sender, instance, created, **kwargs):
    """
    When a new Ticket is created, trigger the AI engine to auto-categorize 
    and prioritize the ticket.
    """
    if created:
        try:
            # Prevent recursive save loops by only updating if priority is 'low' (default)
            if instance.priority == 'low':
                priority, category, reasoning = AiEngineService.triage_ticket(
                    instance.title, instance.description
                )
                
                # Update the instance
                if priority != instance.priority:
                    instance.priority = priority
                    instance.save(update_fields=['priority'])
                    
                    AuditService.log_action(
                        _SystemRequest(instance.created_by), 
                        action="AI_TICKET_TRIAGED", 
                        resource=f"support.Ticket:{instance.pk}", 
                        payload={"new_priority": priority, "reasoning": reasoning}
                    )
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"AI triage skipped for Ticket {instance.pk}: {e}")

@receiver(post_save, sender=Ticket)
def trigger_audit_on_ticket_closure(sender, instance, created, **kwargs):
    """
    Signal: ITSM Incident Closure -> Log audit event.
    When a ticket is closed, log it for compliance and SOC visibility.
    """
    if not created and instance.status == 'closed':
        try:
            user = instance.assigned_to or getattr(instance, 'created_by', None)
            AuditService.log_action(
                _SystemRequest(user), 
                action="TICKET_CLOSED", 
                resource=f"support.Ticket:{instance.pk}", 
                payload={"ticket_title": instance.title, "resolution": "Ticket was marked as closed."}
            )
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Audit log skipped for Ticket {instance.pk}: {e}")

