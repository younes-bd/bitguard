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
