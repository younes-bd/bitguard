from datetime import date
from rest_framework import viewsets, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from integrations.ai_agent.domain.models import AgentProfile, AgentRunLog
from integrations.ai_agent.domain.orchestrator import AgentOrchestrator


class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = '__all__'
        read_only_fields = ('tenant',)


class AgentRunLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentRunLog
        fields = '__all__'
        read_only_fields = (
            'tenant', 'agent', 'triggered_by_model', 'triggered_by_id',
            'thoughts', 'actions_taken', 'final_output',
            'tokens_used', 'duration_ms', 'created_at',
        )


class AgentProfileViewSet(viewsets.ModelViewSet):
    queryset = AgentProfile.objects.all()
    serializer_class = AgentProfileSerializer

    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return self.queryset.filter(tenant=self.request.user.tenant)
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'], url_path='run')
    def run(self, request, pk=None):
        """
        Manually trigger an agent with a test prompt.
        POST /ai_agent/profiles/<id>/run/  { "prompt": "..." }
        """
        agent = self.get_object()
        user_input = request.data.get('prompt', '')
        if not user_input:
            return Response(
                {'error': 'A prompt is required to trigger an agent.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        AgentOrchestrator.handle_event(
            role=agent.role,
            context={'user_input': user_input, 'id': str(agent.id)},
            tenant_id=str(request.user.tenant.id)
        )
        return Response({'status': 'triggered', 'agent': agent.name}, status=status.HTTP_202_ACCEPTED)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """
        Returns KPI stats for the AI Agent dashboard.
        GET /ai_agent/profiles/stats/
        """
        tenant = request.user.tenant
        total   = AgentProfile.objects.filter(tenant=tenant).count()
        active  = AgentProfile.objects.filter(tenant=tenant, is_active=True).count()
        today_logs = AgentRunLog.objects.filter(tenant=tenant, created_at__date=date.today())
        runs_today = today_logs.count()
        success_today = today_logs.filter(status='success').count()
        success_rate = round(success_today / runs_today * 100, 1) if runs_today > 0 else 0.0

        return Response({
            'total_agents':  total,
            'active_agents': active,
            'runs_today':    runs_today,
            'success_rate':  success_rate,
        })


class AgentRunLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AgentRunLog.objects.all()
    serializer_class = AgentRunLogSerializer

    def get_queryset(self):
        qs = self.queryset
        if hasattr(self.request.user, 'tenant'):
            qs = qs.filter(tenant=self.request.user.tenant)
        # Allow filtering by agent_id via query param
        agent_id = self.request.query_params.get('agent')
        if agent_id:
            qs = qs.filter(agent_id=agent_id)
        return qs

