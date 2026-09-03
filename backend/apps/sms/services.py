import logging

logger = logging.getLogger(__name__)

class SMSProvider:
    """
    Adapter for SMS API (e.g., Twilio).
    Other apps should import and use this, NEVER Twilio directly.
    """
    
    @classmethod
    def send_message(cls, to_number: str, message: str) -> dict:
        """
        Sends an SMS message.
        """
        logger.info(f"Preparing to send SMS to {to_number}")
        
        # TODO: Retrieve API keys based on Global or Tenant-Level settings
        # TODO: Call external API (e.g., twilio_client.messages.create(...))
        
        # Mock success for now
        return {
            "status": "success",
            "provider_message_id": "mock_id_12345",
            "to": to_number
        }
