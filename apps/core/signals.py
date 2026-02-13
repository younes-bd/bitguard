from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from django.apps import apps
import logging

logger = logging.getLogger(__name__)

# --- Commerce Events (Section 20) ---
# Sent when an order is successfully paid via Stripe
# Providing: order, request (optional)
order_paid = Signal()

# --- Customer Lifecycle Events (Section 15, 20) ---
# Sent when a client's status changes
# Providing: client, old_status, new_status, request (optional)
lifecycle_transition = Signal()

# --- Service Delivery Events (Section 16, 20) ---
# Sent when a new project/obligation is created from an order
# Providing: project, order, request (optional)
obligation_created = Signal()

@receiver(post_save, sender='crm.Deal')
def create_project_agreement_from_deal(sender, instance, created, **kwargs):
    """
    When a Deal is marked as 'won', create a corresponding Project (InternalProject) in ERP
    if one doesn't exist.
    """
    if instance.stage == 'won':
        InternalProject = apps.get_model('erp', 'InternalProject')
        
        # Check if project already exists for this deal (by name or client logic)
        #Ideally Deal would have a 'project' field, but we can check by name convention for now
        project_name = f"Project: {instance.name}"
        
        project, created_proj = InternalProject.objects.get_or_create(
            name=project_name,
            client=instance.client,
            defaults={
                'status': 'planning',
                'description': f"Generated from Deal: {instance.name} (ID: {instance.id})",
                'budget': instance.value or 0
            }
        )
        if created_proj:
            logger.info(f"Created ERP Project '{project_name}' from Deal {instance.id}")

@receiver(post_save, sender='store.Order')
def sync_crm_client_from_order(sender, instance, created, **kwargs):
    """
    When a Store Order is created, ensure the User has a CRM Client profile.
    """
    if created and instance.user:
        Client = apps.get_model('crm', 'Client')
        Contact = apps.get_model('crm', 'Contact')
        
        # Check if Contact exists
        contact = Contact.objects.filter(email=instance.user.email).first()
        
        if not contact:
            # Create Client (Individual)
            client = Client.objects.create(
                name=f"{instance.user.first_name} {instance.user.last_name}" or instance.user.username,
                client_type='individual',
                status='active',
                email=instance.user.email
            )
            
            # Create Contact linked to User
            Contact.objects.create(
                client=client,
                email=instance.user.email,
                first_name=instance.user.first_name,
                last_name=instance.user.last_name,
                is_primary=True,
                role='Customer'
            )
            logger.info(f"Created CRM Client & Contact for Order User {instance.user.username}")

@receiver(order_paid)
def log_accounting_event(sender, order, request=None, **kwargs):
    """
    Section 18: Payments generate accounting events.
    Ensures commerce UI does not equal financial truth.
    """
    from apps.core.services.audit import AuditService
    AuditService.log(
        request,
        action="ACCOUNTING_EVENT",
        resource=f"commerce.Order:{order.id}",
        payload={
            "type": "REVENUE",
            "amount": float(order.amount) if hasattr(order, 'amount') else 0,
            "currency": order.user.currency if hasattr(order.user, 'currency') else "USD",
            "source": sender.__name__ if sender else "Stripe"
        }
    )

@receiver(lifecycle_transition)
def handle_systemic_lifecycle_change(sender, client, old_status, new_status, request=None, **kwargs):
    """
    Section 15: React to client status changes system-wide.
    """
    from apps.core.services.audit import AuditService
    AuditService.log(
        request,
        action="LIFECYCLE_TRANSITION",
        resource=f"crm.Client:{client.pk}",
        payload={"old": old_status, "new": new_status}
    )
