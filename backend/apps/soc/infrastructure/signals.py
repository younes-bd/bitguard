from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.soc.models import Alert

@receiver(post_save, sender=Alert)
def escalate_alert_to_incident(sender, instance, created, **kwargs):
    """
    Escalates high/critical severity alerts to an Incident in ITSM/Support automatically.
    """
    if created and instance.severity in ['high', 'critical']:
        from apps.soc.models import Incident
        from apps.support.models import Ticket
        
        incident = Incident.objects.create(
            tenant=instance.tenant,
            title=f"Auto-Incident: {instance.title}",
            description=instance.description,
            status='open'
        )
        incident.alerts.add(instance)
        
        Ticket.objects.create(
            tenant=instance.tenant,
            title=f"SECURITY ALERT: {instance.title}",
            description=f"Source: {instance.source}\nSeverity: {instance.severity}\n\n{instance.description}",
            status='open',
            priority='critical',
        )
