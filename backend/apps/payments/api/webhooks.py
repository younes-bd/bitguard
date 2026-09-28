import json
import logging
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..models import PaymentTransaction

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    """
    Secure endpoint to receive events from Stripe.
    Must be exempt from CSRF since Stripe servers don't have our CSRF tokens.
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    # TODO: In production, uncomment and configure the Stripe SDK to verify the signature:
    # try:
    #     event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    # except stripe.error.SignatureVerificationError:
    #     return HttpResponse(status=400)

    try:
        event = json.loads(payload)
    except ValueError:
        return HttpResponse(status=400)

    # Handle the event
    if event.get('type') == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        transaction_id = payment_intent.get('id')
        
        logger.info(f"Stripe Webhook: Payment succeeded for intent {transaction_id}")
        
        # 1. Update the transaction in our database
        PaymentTransaction.objects.filter(transaction_id=transaction_id).update(status='succeeded')
        
        # 2. In a fully decoupled ERP, we emit a Django Signal here.
        # The `accounting` app listens for this signal and automatically marks the linked Invoice as "Paid".
        # e.g., payment_succeeded.send(sender=PaymentTransaction, transaction_id=transaction_id)

    elif event.get('type') == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        transaction_id = payment_intent.get('id')
        logger.warning(f"Stripe Webhook: Payment failed for intent {transaction_id}")
        PaymentTransaction.objects.filter(transaction_id=transaction_id).update(status='failed')

    return HttpResponse(status=200)
