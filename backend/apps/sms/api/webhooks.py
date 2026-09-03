import logging
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..models import SMSLog

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def twilio_webhook(request):
    """
    Secure endpoint to receive delivery receipts from Twilio.
    Twilio sends data as form-urlencoded POST requests.
    """
    message_sid = request.POST.get('MessageSid')
    message_status = request.POST.get('MessageStatus')

    if message_sid and message_status:
        logger.info(f"Twilio Webhook: SMS {message_sid} status updated to {message_status}")
        
        # Update the delivery status in our logs (e.g., 'sent', 'delivered', 'failed')
        SMSLog.objects.filter(provider_message_id=message_sid).update(status=message_status)
        
    return HttpResponse(status=200)
