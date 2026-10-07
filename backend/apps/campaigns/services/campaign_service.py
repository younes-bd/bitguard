from django.utils import timezone
from apps.campaigns.domain.models import Campaign

class CampaignService:
    @staticmethod
    def schedule_campaign(campaign: Campaign, schedule_date):
        if campaign.state != 'draft':
            raise ValueError("Only draft campaigns can be scheduled.")
        campaign.schedule_date = schedule_date
        campaign.state = 'scheduled'
        campaign.save(update_fields=['schedule_date', 'state'])
        return campaign

    @staticmethod
    def send_campaign(campaign: Campaign):
        if campaign.state not in ['draft', 'scheduled']:
            raise ValueError("Campaign must be draft or scheduled to send.")
        
        # Simulate sending logic
        campaign.state = 'sending'
        campaign.save(update_fields=['state'])

        # Count actual contacts in the mailing list
        contact_count = 0
        if campaign.mailing_list:
            contact_count = campaign.mailing_list.contacts.filter(opt_out=False).count()

        campaign.sent_count = contact_count
        campaign.sent_date = timezone.now()
        campaign.state = 'sent'
        campaign.save(update_fields=['sent_count', 'sent_date', 'state'])
        
        return campaign
