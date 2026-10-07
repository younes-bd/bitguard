from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
import logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender='inventory.InventoryItem')
def handle_low_stock(sender, instance, created, **kwargs):
    if instance.quantity_on_hand <= instance.reorder_level:
        Notification = apps.get_model('inbox', 'Notification')
        User = apps.get_model('users', 'User')
        admins = User.objects.filter(tenant=instance.tenant, role__name='TENANT_ADMIN')
        for admin in admins:
            Notification.objects.create(
                user=admin,
                tenant=instance.tenant,
                title="Low Stock Alert",
                message=f"Item {instance.sku} is below reorder level.",
                type="low_stock"
            )
