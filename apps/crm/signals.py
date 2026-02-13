from django.dispatch import receiver
from apps.core.signals import order_paid
from .services import CustomerService
from apps.store.models import Subscription

@receiver(order_paid)
def handle_lifecycle_on_payment(sender, order, request=None, **kwargs):
    """
    Section 15: Derive customer lifecycle stage from commerce events.
    """
    # If it's a subscription, stage is 'subscriber'
    if isinstance(order, Subscription):
        CustomerService.update_lifecycle(order.user, 'subscriber', request=request)
    else:
        # Generic order makes them an 'active' customer
        CustomerService.update_lifecycle(order.user, 'active', request=request)
