from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from django.apps import apps
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

# --- Commerce Events ---
order_paid = Signal() # Providing: order, request

# --- Customer Lifecycle Events ---
lifecycle_transition = Signal() # Providing: client, old_status, new_status, request

# --- Service Delivery Events ---
obligation_created = Signal() # Providing: project, order, request

@receiver(post_save, sender='crm.Deal')
def handle_deal_won(sender, instance, created, **kwargs):
    """
    Deal.stage = 'won' → create projects.Project
    """
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


@receiver(order_paid)
def handle_order_paid(sender, order, request=None, **kwargs):
    """
    store.Order.status = 'paid' → create or update core.Partner and crm.Client
    """
    Partner = apps.get_model('core', 'Partner')
    Client = apps.get_model('crm', 'Client')
    
    with transaction.atomic():
        partner, p_created = Partner.objects.update_or_create(
            email=order.user.email,
            defaults={
                'name': f"{order.user.first_name} {order.user.last_name}".strip() or order.user.username,
                'partner_type': 'customer'
            }
        )
        client, created = Client.objects.update_or_create(
            email=order.user.email,
            tenant=order.tenant,
            defaults={
                'name': partner.name,
                'partner': partner,
                'status': 'active',
            }
        )
        logger.info(f"Synced core.Partner and crm.Client for paid Order {order.id}")

@receiver(post_save, sender='contracts.Quote')
def handle_quote_accepted(sender, instance, created, **kwargs):
    """
    contracts.Quote.status = 'accepted' → Disable auto-generation to prevent duplicates.
    Now handled by centralized billing orchestrator.
    """
    pass

@receiver(post_save, sender='stock.InventoryItem')
def handle_low_stock(sender, instance, created, **kwargs):
    """
    scm.InventoryItem.quantity_on_hand <= reorder_level → create notifications.Notification with type='low_stock'
    """
    if instance.quantity_on_hand <= instance.reorder_level:
        Notification = apps.get_model('notifications', 'Notification')
        User = apps.get_model('users', 'User')
        
        # Notify tenant admins
        admins = User.objects.filter(tenant=instance.tenant, role__name='TENANT_ADMIN')
        for admin in admins:
            Notification.objects.create(
                user=admin,
                tenant=instance.tenant,
                title="Low Stock Alert",
                message=f"Item {instance.sku} is below reorder level.",
                type="low_stock"
            )

@receiver(post_save, sender='contracts.ServiceContract')
def handle_contract_created(sender, instance, created, **kwargs):
    """
    contracts.ServiceContract created → create soc.Workspace
    """
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

@receiver(post_save, sender='contracts.SLABreach')
def handle_sla_breach(sender, instance, created, **kwargs):
    """
    contracts.SLABreach created → create soc.Alert
    """
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

