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
    Deal.stage = 'won' → create erp.InternalProject
    """
    if instance.stage == 'won':
        InternalProject = apps.get_model('erp', 'InternalProject')
        with transaction.atomic():
            project, created_proj = InternalProject.objects.get_or_create(
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
                logger.info(f"Created InternalProject from Deal {instance.id}")

@receiver(order_paid)
def handle_order_paid(sender, order, request=None, **kwargs):
    """
    store.Order.status = 'paid' → create or update crm.Client
    """
    Client = apps.get_model('crm', 'Client')
    Contact = apps.get_model('crm', 'Contact')
    
    with transaction.atomic():
        client, created = Client.objects.update_or_create(
            email=order.user.email,
            tenant=order.tenant,
            defaults={
                'name': f"{order.user.first_name} {order.user.last_name}".strip() or order.user.username,
                'status': 'active',
            }
        )
        Contact.objects.get_or_create(
            client=client,
            email=order.user.email,
            tenant=order.tenant,
            defaults={'is_primary': True}
        )
        logger.info(f"Synced CRM Client for paid Order {order.id}")

@receiver(post_save, sender='contracts.Quote')
def handle_quote_accepted(sender, instance, created, **kwargs):
    """
    contracts.Quote.status = 'accepted' → create erp.Invoice + erp.InternalProject in same transaction.atomic()
    """
    if instance.status == 'accepted':
        Invoice = apps.get_model('erp', 'Invoice')
        InternalProject = apps.get_model('erp', 'InternalProject')
        
        with transaction.atomic():
            # Create Invoice
            invoice = Invoice.objects.create(
                tenant=instance.tenant,
                client=instance.client,
                amount=instance.total,
                status='sent',
                issue_date=timezone.now().date(),
                due_date=timezone.now().date() + timezone.timedelta(days=30),
                invoice_number=f"INV-QT-{instance.id.hex[:8].upper()}"
            )
            # Create Project
            InternalProject.objects.create(
                tenant=instance.tenant,
                client=instance.client,
                name=f"Project for Quote {instance.id.hex[:8].upper()}",
                status='planning'
            )
            logger.info(f"Created Invoice and Project for accepted Quote {instance.id}")

@receiver(post_save, sender='scm.InventoryItem')
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

