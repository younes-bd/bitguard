from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.api.mixins import TenantScopedMixin
from apps.campaigns.domain.models import Campaign, MailingList, MailingContact
from apps.campaigns.api.serializers import CampaignSerializer, MailingListSerializer, MailingContactSerializer
from apps.campaigns.services.campaign_service import CampaignService

class MailingListViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = MailingList.objects.all()
    serializer_class = MailingListSerializer

class MailingContactViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = MailingContact.objects.all()
    serializer_class = MailingContactSerializer

class CampaignViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    @action(detail=True, methods=['post'])
    def send_now(self, request, pk=None):
        campaign = self.get_object()
        try:
            updated_campaign = CampaignService.send_campaign(campaign)
            return Response(CampaignSerializer(updated_campaign).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        campaign = self.get_object()
        schedule_date = request.data.get('schedule_date')
        if not schedule_date:
            return Response({'error': 'schedule_date is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            updated_campaign = CampaignService.schedule_campaign(campaign, schedule_date)
            return Response(CampaignSerializer(updated_campaign).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
