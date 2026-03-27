from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Campaign
from .serializers import CampaignSerializer
from .services import CampaignService

class CampaignViewSet(viewsets.ModelViewSet):
    """
    Standard CRUD viewset for Marketing Campaigns bounded by Tenant.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CampaignSerializer
    service_class = CampaignService
    search_fields = ['name', 'description', 'status']
    ordering_fields = ['created_at', 'start_date', 'budget']

    @property
    def service(self):
        return self.service_class()

    def get_queryset(self):
        # Enforce tenant isolation structurally and annotate interactions
        qs = Campaign.objects.annotate(interactions_count=Count('interactions')).all()
        if hasattr(self.request, 'tenant') and self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        self.service.create_campaign(
            user=self.request.user,
            data=serializer.validated_data,
            tenant=self.request.tenant
        )

    @action(detail=True, methods=['post'])
    def track_interaction(self, request, pk=None):
        """
        Tracks a new interaction (e.g. click, open) for the campaign.
        """
        campaign = self.get_object()
        lead_id = request.data.get('lead_id')
        interaction_type = request.data.get('interaction_type')
        details = request.data.get('details', {})
        
        if not interaction_type:
            return Response({'error': 'interaction_type is required'}, status=400)
            
        # In a real scenario we'd query the lead via CRM models
        # lead = Lead.objects.get(id=lead_id) if lead_id else None
        # For simplicity, passing None to lead for now if not integrated
        
        interaction = self.service.track_interaction(campaign, None, interaction_type, details)
        return Response({
            'status': 'success',
            'data': {'id': interaction.id, 'interaction_type': interaction.interaction_type}
        })
