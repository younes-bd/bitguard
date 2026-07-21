from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from django.db.models import Count
from ..domain.models import Campaign
from ..api.serializers import CampaignSerializer
from ..application.services import CampaignService

MOCK_INTEGRATIONS = [
    { 'name': 'Google Analytics', 'description': 'Track website traffic and campaign attribution', 'connected': True, 'icon': '📊' },
    { 'name': 'Mailchimp', 'description': 'Mass Mailing automation and subscriber management', 'connected': False, 'icon': '📧' },
    { 'name': 'HubSpot', 'description': 'Inbound marketing and lead scoring', 'connected': False, 'icon': '🟠' },
    { 'name': 'Facebook Ads', 'description': 'Social media advertising and retargeting', 'connected': True, 'icon': '📘' },
    { 'name': 'Google Ads', 'description': 'Search and display advertising campaigns', 'connected': False, 'icon': '🔍' },
    { 'name': 'LinkedIn Ads', 'description': 'B2B advertising and sponsored content', 'connected': False, 'icon': '🔗' },
    { 'name': 'Zapier', 'description': 'Workflow automation between marketing tools', 'connected': True, 'icon': '⚡' },
    { 'name': 'Slack', 'description': 'Team notifications for campaign events', 'connected': True, 'icon': '💬' },
]

class IntegrationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        return Response({'results': MOCK_INTEGRATIONS})

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        name = request.data.get('name')
        if not name:
            return Response({'error': 'name required'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'success', 'is_connected': True})

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

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        Returns stats for a specific campaign.
        """
        campaign = self.get_object()
        from ..domain.models import CampaignInteraction
        interactions = CampaignInteraction.objects.filter(campaign=campaign)
        
        return Response({
            'total_interactions': interactions.count(),
            'by_type': interactions.values('interaction_type').annotate(count=Count('id')),
            'daily_reach': [
                {'date': '2024-04-20', 'count': 45},
                {'date': '2024-04-21', 'count': 52},
                {'date': '2024-04-22', 'count': 48},
                {'date': '2024-04-23', 'count': 61},
                {'date': '2024-04-24', 'count': 55},
                {'date': '2024-04-25', 'count': 67},
                {'date': '2024-04-26', 'count': 72},
            ] # Mocked historical data for chart
        })

    @action(detail=False, methods=['get'])
    def global_stats(self, request):
        """
        Returns aggregated stats for all campaigns.
        """
        qs = self.get_queryset()
        from ..domain.models import CampaignInteraction
        interactions = CampaignInteraction.objects.filter(campaign__in=qs)
        
        return Response({
            'total_campaigns': qs.count(),
            'active_campaigns': qs.filter(status='active').count(),
            'total_interactions': interactions.count(),
            'engagement_rate': 4.2, # Mocked percentage
            'trend_data': [
                {'name': 'Week 1', 'conversions': 400, 'spend': 2400, 'leads': 2400},
                {'name': 'Week 2', 'conversions': 300, 'spend': 1398, 'leads': 2210},
                {'name': 'Week 3', 'conversions': 200, 'spend': 9800, 'leads': 2290},
                {'name': 'Week 4', 'conversions': 278, 'spend': 3908, 'leads': 2000},
                {'name': 'Week 5', 'conversions': 189, 'spend': 4800, 'leads': 2181},
                {'name': 'Week 6', 'conversions': 239, 'spend': 3800, 'leads': 2500},
            ]
        })

class MarketingDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Campaign.objects.all()
        if hasattr(request, 'tenant') and request.tenant:
            qs = qs.filter(tenant=request.tenant)
            
        from ..domain.models import CampaignInteraction
        interactions = CampaignInteraction.objects.filter(campaign__in=qs)
        
        return standard_response(True, "Marketing Dashboard Data", {
            'total_campaigns': qs.count(),
            'active_campaigns': qs.filter(status='active').count(),
            'total_interactions': interactions.count(),
            'engagement_rate': 4.2, # Still using mock stat for now until actual metric calculation is added
            'trend_data': [
                {'name': 'Week 1', 'conversions': 400, 'spend': 2400, 'leads': 2400},
                {'name': 'Week 2', 'conversions': 300, 'spend': 1398, 'leads': 2210},
                {'name': 'Week 3', 'conversions': 200, 'spend': 9800, 'leads': 2290},
                {'name': 'Week 4', 'conversions': 278, 'spend': 3908, 'leads': 2000},
                {'name': 'Week 5', 'conversions': 189, 'spend': 4800, 'leads': 2181},
                {'name': 'Week 6', 'conversions': 239, 'spend': 3800, 'leads': 2500},
            ]
        })

from ..domain.models import MassMailing, SocialPost, SMSCampaign, Event, Survey
from .serializers import MassMailingSerializer, SocialPostSerializer, SMSCampaignSerializer, EventSerializer, SurveySerializer

class MassMailingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MassMailingSerializer
    def get_queryset(self): return MassMailing.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else MassMailing.objects.all()

class SocialPostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SocialPostSerializer
    def get_queryset(self): return SocialPost.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else SocialPost.objects.all()

class SMSCampaignViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SMSCampaignSerializer
    def get_queryset(self): return SMSCampaign.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else SMSCampaign.objects.all()

class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer
    def get_queryset(self): return Event.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Event.objects.all()

class SurveyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SurveySerializer
    def get_queryset(self): return Survey.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Survey.objects.all()
