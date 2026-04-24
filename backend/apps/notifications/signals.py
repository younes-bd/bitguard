from django.db.models.signals import post_save
from django.dispatch import receiver

# Subscribe to critical ecosystem nodes
@receiver(post_save, sender='store.Order')
@receiver(post_save, sender='support.Ticket')
@receiver(post_save, sender='approvals.ApprovalRequest')
@receiver(post_save, sender='itsm.ChangeRequest')
def push_global_notification(sender, instance, created, **kwargs):
    if not created:
        return
        
    from apps.notifications.models import Notification
    
    sender_name = sender._meta.model_name
    title = ""
    message = ""
    
    if sender_name == 'order':
        title = "New Store Order Placed"
        message = f"Order #{instance.id} for ${instance.total}."
    elif sender_name == 'ticket':
        title = f"Support Ticket Generated ({instance.priority})"
        message = instance.title
    elif sender_name == 'approvalrequest':
        title = "Enterprise Approval Requested"
        message = instance.title
    elif sender_name == 'changerequest':
        title = f"ITSM Change Engaged ({instance.risk_level} Risk)"
        message = instance.title

    if title and message:
        Notification.objects.create(
            title=title,
            message=message,
            notification_type='system',
            priority='high' if 'critical' in message.lower() or 'high' in message.lower() else 'normal'
        )
