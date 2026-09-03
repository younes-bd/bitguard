from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from apps.sale.domain.models import SaleOrder
from apps.notifications.application.services import NotificationService

sale_order_confirmed_signal = Signal()

@receiver(post_save, sender=SaleOrder)
def sale_order_confirmed(sender, instance, created, **kwargs):
    if instance.status == 'sale' or instance.status == 'confirmed':
        if getattr(instance, '_signal_sent', False):
            return
        instance._signal_sent = True
        
        # Dispatch to other apps using Rule 12B!
        sale_order_confirmed_signal.send(sender=SaleOrder, instance=instance)
        
        if instance.assigned_to:
            NotificationService.create_notification(
                user=instance.assigned_to,
                tenant=instance.tenant,
                n_type='erp',
                title='Sale Order Confirmed',
                message=f'Sale order {instance.order_number} has been confirmed.'
            )
