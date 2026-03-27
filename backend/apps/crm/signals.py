from django.dispatch import receiver
from apps.core.signals import order_paid
from .services import ClientService

@receiver(order_paid)
def handle_lifecycle_on_payment(sender, order, request=None, **kwargs):
    """
    Charter §15: Derive customer lifecycle stage from commerce events.
    """
    # Import locally to avoid circular dependency
    from apps.billing.models import Subscription
    
    # If it's a subscription, stage is 'subscriber'
    if isinstance(order, Subscription):
        ClientService.update_client(request, order.user.client, {'status': 'subscriber'})
    else:
        # Generic order makes them an 'active' customer
        if hasattr(order.user, 'client') and order.user.client:
            ClientService.update_client(request, order.user.client, {'status': 'active'})
