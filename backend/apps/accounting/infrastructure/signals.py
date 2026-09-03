from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from apps.accounting.domain.models import Invoice, Payment
from apps.notifications.application.services import NotificationService

User = get_user_model()

@receiver(post_save, sender=Payment)
def payment_received(sender, instance, created, **kwargs):
    if created and instance.invoice and instance.invoice.client:
        admin = User.objects.filter(tenant=instance.tenant, is_superuser=True).first()
        if admin:
            NotificationService.create_notification(
                user=admin,
                tenant=instance.tenant,
                n_type='billing',
                title='Payment Received',
                message=f'A payment of {instance.amount} was received for invoice {instance.invoice.invoice_number}.'
            )

@receiver(post_save, sender=Invoice)
def invoice_overdue(sender, instance, created, **kwargs):
    if instance.status == 'overdue':
        admin = User.objects.filter(tenant=instance.tenant, is_superuser=True).first()
        if admin:
            NotificationService.create_notification(
                user=admin,
                tenant=instance.tenant,
                n_type='billing',
                title='Invoice Overdue',
                message=f'Invoice {instance.invoice_number} is overdue.'
            )
