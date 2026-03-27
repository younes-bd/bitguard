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
    Charter §16: When a Deal is marked as 'won', create a corresponding
    InternalProject (service delivery obligation) in ERP if one doesn't already exist.
    Field correction: Deal uses 'title' and 'amount' (not 'name'/'value').
    """
    if instance.stage == 'won':
        InternalProject = apps.get_model('erp', 'InternalProject')

        project_name = f"Project: {instance.title}"

        project, created_proj = InternalProject.objects.get_or_create(
            name=project_name,
            client=instance.client,
            defaults={
                'status': 'planning',
                'description': f"Generated from Deal: {instance.title} (ID: {instance.id})",
                'budget': instance.amount or 0,
                'deal_id': instance.id,
            }
        )
        if created_proj:
            logger.info(f"Created ERP InternalProject '{project_name}' from Deal {instance.id}")
            # Emit the obligation_created event for downstream subscribers
            obligation_created.send(
                sender=InternalProject,
                project=project,
                order=None,
            )


@receiver(post_save, sender='store.Order')
def sync_crm_client_from_order(sender, instance, created, **kwargs):
    """
    Charter §6: When a Store Order is created, ensure the ordering User
    has a CRM Client + Contact profile so commerce and CRM stay in sync.
    Corrected app label from 'billing.Order' to 'store.Order'.
    """
    if created and instance.user:
        Client = apps.get_model('crm', 'Client')
        Contact = apps.get_model('crm', 'Contact')

        # Check if a Contact already exists for this email
        contact = Contact.objects.filter(email=instance.user.email).first()

        if not contact:
            # Determine the tenant — store.Order carries a tenant FK
            tenant = getattr(instance, 'tenant', None)

            full_name = (
                f"{instance.user.first_name} {instance.user.last_name}".strip()
                or instance.user.username
            )

            # Create a Client record (lifecycle starts as 'active' because they just purchased)
            client = Client(
                name=full_name,
                client_type='individual',
                status='active',
                email=instance.user.email,
                tenant=tenant,
            )
            # Skip save() if no tenant — TenantAwareModel requires it
            if tenant:
                client.save()

                # Create the primary Contact linked to this Client
                Contact.objects.create(
                    client=client,
                    email=instance.user.email,
                    first_name=instance.user.first_name or '',
                    last_name=instance.user.last_name or instance.user.username,
                    is_primary=True,
                    role='Customer',
                    tenant=tenant,
                )
                logger.info(
                    f"Created CRM Client & Contact for Store Order user '{instance.user.email}'"
                )
            else:
                logger.warning(
                    f"Store Order {instance.id} has no tenant — skipping CRM sync for user '{instance.user.email}'"
                )


@receiver(order_paid)
def log_accounting_event(sender, order, request=None, **kwargs):
    """
    Charter §18: Payments generate accounting events.
    Ensures commerce UI does not equal financial truth.
    """
    from apps.core.services.audit import AuditService
    AuditService.log_action(
        request,
        action="ACCOUNTING_EVENT",
        resource=f"store.Order:{order.id}",
        payload={
            "type": "REVENUE",
            "amount": float(order.total_amount) if hasattr(order, 'total_amount') else 0,
            "currency": "USD",
            "source": "Stripe",
        }
    )


@receiver(lifecycle_transition)
def handle_systemic_lifecycle_change(sender, client, old_status, new_status, request=None, **kwargs):
    """
    Charter §15: React to client lifecycle status changes system-wide.
    Every transition is auditable.
    """
    from apps.core.services.audit import AuditService
    AuditService.log_action(
        request,
        action="LIFECYCLE_TRANSITION",
        resource=f"crm.Client:{client.pk}",
        payload={"old": old_status, "new": new_status}
    )
