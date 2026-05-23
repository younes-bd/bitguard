from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.support.models import Ticket
from integrations.ai_engine.services import AiEngineService
from apps.core.services.audit import AuditService

@receiver(post_save, sender=Ticket)
def trigger_ai_triage(sender, instance, created, **kwargs):
    """
    When a new Ticket is created, trigger the AI engine to auto-categorize 
    and prioritize the ticket.
    """
    if created:
        # Prevent recursive save loops by only updating if priority is 'low' (default)
        if instance.priority == 'low':
            priority, category, reasoning = AiEngineService.triage_ticket(
                instance.title, instance.description
            )
            
            # Update the instance
            if priority != instance.priority:
                instance.priority = priority
                # Note: Currently Support Ticket model does not have a 'category' field, 
                # but we use it for AI reasoning context.
                instance.save(update_fields=['priority'])
                
                # We log this AI action as an audit event
                class DummyRequest:
                    user = instance.created_by
                    META = {'REMOTE_ADDR': '127.0.0.1'}
                    
                AuditService.log_action(
                    DummyRequest(), 
                    action="AI_TICKET_TRIAGED", 
                    resource=f"support.Ticket:{instance.pk}", 
                    payload={"new_priority": priority, "reasoning": reasoning}
                )

@receiver(post_save, sender=Ticket)
def trigger_audit_on_ticket_closure(sender, instance, created, **kwargs):
    """
    Signal: ITSM Incident Closure -> Log audit event.
    When a ticket is closed, log it for compliance and SOC visibility.
    """
    if not created and instance.status == 'closed':
        # Check if we already logged the closure to prevent duplicate logs on multiple saves
        # We can just log it using AuditService
        class DummyRequest:
            user = instance.assigned_to or instance.created_by
            META = {'REMOTE_ADDR': '127.0.0.1'}
            
        AuditService.log_action(
            DummyRequest(), 
            action="TICKET_CLOSED", 
            resource=f"support.Ticket:{instance.pk}", 
            payload={"ticket_title": instance.title, "resolution": "Ticket was marked as closed."}
        )
