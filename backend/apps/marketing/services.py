from apps.core.services.base import BaseService
from .models import Campaign, CampaignInteraction

class CampaignService(BaseService):
    model = Campaign

    def create_campaign(self, user, data, tenant):
        """
        Creates a new marketing campaign and ensures it belongs to the active tenant.
        """
        data['tenant'] = tenant
        data['created_by'] = user
        return super().create(data)

    def track_interaction(self, campaign, lead, interaction_type, details=None):
        interaction = CampaignInteraction.objects.create(
            campaign=campaign,
            lead=lead,
            interaction_type=interaction_type,
            details=details or {}
        )
        return interaction
