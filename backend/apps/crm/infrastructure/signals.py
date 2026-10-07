from django.dispatch import receiver
from django.apps import apps
from django.db import transaction
import logging
try:
    from django.apps import apps
    if apps.is_installed("apps.ecommerce"):
        from apps.ecommerce.signals import order_paid
    else:
        order_paid = None
except ImportError:
    order_paid = None
logger = logging.getLogger(__name__)

if order_paid:
    @receiver(order_paid)
    def handle_order_paid(sender, order, request=None, **kwargs):
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
