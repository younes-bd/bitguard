from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.core.signals import order_paid
from .models import InternalProject

@receiver(order_paid)
def handle_order_fulfillment(sender, order, request=None, **kwargs):
    """
    Section 16: Create Delivery Obligation.
    De-coupled from Store module via explicit signals.
    """
    from .services import EnterpriseService
    EnterpriseService.create_delivery_obligation(order, request=request)

@receiver(post_save, sender=InternalProject)
def sync_erp_to_crm(sender, instance, created, **kwargs):
    """
    Automated Bridge: ERP (Execution) -> CRM (Sales/Client)
    
    When Operations updates the detailed InternalProject, we automatically 
    update the high-level CRM Project status and dates so the user/client 
    sees "Real Time" progress without manual double-entry.
    """
    if not instance.crm_project:
        return

    crm_project = instance.crm_project
    changed = False

    # 1. Status Mapping (ERP -> CRM status)
    # We map granular execution statuses to high-level client stages.
    status_map = {
        'planning': 'not_started',
        'active': 'in_progress',
        'on_hold': 'on_hold',
        'completed': 'completed',
        'cancelled': 'on_hold', # Clients usually see 'On Hold' for cancelled internal works until verified
    }

    new_status = status_map.get(instance.status)
    if new_status and crm_project.status != new_status:
        crm_project.status = new_status
        changed = True

    # 2. Schedule Sync
    # Operations knows the REAL deadline, so we overwrite the sales estimate.
    if instance.deadline and crm_project.end_date != instance.deadline:
        crm_project.end_date = instance.deadline
        changed = True

    if changed:
        crm_project.save()
