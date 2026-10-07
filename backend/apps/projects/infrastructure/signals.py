from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from django.db import transaction
import logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender='crm.Deal')
def handle_deal_won(sender, instance, created, **kwargs):
    if instance.stage == 'won':
        Project = apps.get_model('projects', 'Project')
        try:
            with transaction.atomic():
                project, created_proj = Project.objects.get_or_create(
                    tenant=instance.tenant,
                    client=instance.client,
                    name=f"Project: {instance.title}",
                    defaults={
                        'status': 'planning',
                        'description': f"Auto-created from Deal {instance.id}",
                        'budget': instance.amount or 0,
                    }
                )
                if created_proj:
                    logger.info(f"Created Project from Deal {instance.id}")
        except Exception as e:
            logger.warning(f"Signal handle_deal_won skipped for Deal {instance.id}: {e}")
