import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.apps import apps

logger = logging.getLogger(__name__)

# To avoid circular imports, we import the engine inside the signal
@receiver(post_save)
def trigger_automation_on_save(sender, instance, created, **kwargs):
    """
    Global signal that listens to every model save event.
    Evaluates 'on_create' and 'on_write' automation rules.
    """
    # Prevent infinite loops or acting on automation models themselves
    if sender._meta.app_label in ['automation', 'sessions', 'admin', 'contenttypes']:
        return

    trigger_type = 'on_create' if created else 'on_write'
    model_name = f"{sender._meta.app_label}.{sender.__name__}"

    from .engine import AutomationEngine
    AutomationEngine.evaluate_rules(instance, model_name, trigger_type)

@receiver(post_delete)
def trigger_automation_on_delete(sender, instance, **kwargs):
    """
    Global signal that listens to every model delete event.
    Evaluates 'on_unlink' automation rules.
    """
    if sender._meta.app_label in ['automation', 'sessions', 'admin', 'contenttypes']:
        return

    model_name = f"{sender._meta.app_label}.{sender.__name__}"

    from .engine import AutomationEngine
    AutomationEngine.evaluate_rules(instance, model_name, 'on_unlink')
