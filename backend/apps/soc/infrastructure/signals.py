from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
import logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender='subscriptions.servicecontract')
def handle_contract_created(sender, instance, created, **kwargs):
    if created:
        Workspace = apps.get_model('soc', 'Workspace')
        Workspace.objects.get_or_create(
            tenant=instance.tenant,
            defaults={
                'name': f"SOC Workspace: {instance.client.name}",
                'is_active': True
            }
        )
        logger.info(f"Created SOC Workspace for Contract {instance.id}")

@receiver(post_save, sender='helpdesk.slabreach')
def handle_sla_breach(sender, instance, created, **kwargs):
    if created:
        Alert = apps.get_model('soc', 'Alert')
        Alert.objects.create(
            tenant=instance.tenant,
            title=f"SLA Breach: {instance.get_breach_type_display()}",
            description=f"A breach occurred on contract {instance.contract} for ticket {instance.ticket_id}.",
            severity='high',
            source='SLA_MONITOR'
        )
        logger.info(f"Created SOC Alert for SLA Breach {instance.id}")
