from apps.core.api.mixins import TenantScopedMixin
"""
Support Views — Charter §8, §9 Compliant
Ticket views delegate all mutations to TicketService.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as drf_status
from ..domain.models import (
    Ticket, TicketMessage, KnowledgeArticle,
    HelpdeskTeam, HelpdeskStage, HelpdeskTag, SlaPolicy
)
from ..api.serializers import (
    TicketSerializer, TicketMessageSerializer, KnowledgeArticleSerializer,
    HelpdeskTeamSerializer, HelpdeskStageSerializer, HelpdeskTagSerializer, SlaPolicySerializer
)
from ..application.services import TicketService, TicketMessageService


class TicketViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer

    def get_queryset(self):
        return TicketService.get_queryset(self.request)

    def perform_create(self, serializer):
        TicketService.create_ticket(self.request, serializer.validated_data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolves a ticket with audit logging."""
        ticket = self.get_object()
        TicketService.resolve_ticket(request, ticket)
        from apps.core.services.audit import AuditService
        AuditService.log_action(request.user, 'HELPDESK_TICKET_CLOSED', f"Ticket {ticket.id} closed", ticket)
        return Response({'status': 'resolved'})

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        ticket = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=drf_status.HTTP_400_BAD_REQUEST)
        try:
            TicketService.assign_ticket(request, ticket, user_id)
            return Response(TicketSerializer(ticket).data)
        except Exception as e:
            return Response({'error': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='set-stage')
    def set_stage(self, request, pk=None):
        ticket = self.get_object()
        stage_id = request.data.get('stage_id')
        if not stage_id:
            return Response({'error': 'stage_id is required'}, status=drf_status.HTTP_400_BAD_REQUEST)
        try:
            stage = HelpdeskStage.objects.get(id=stage_id, tenant=request.user.tenant)
            ticket.stage = stage
            if stage.is_closed:
                ticket.status = 'closed'
                from apps.core.services.audit import AuditService
                AuditService.log_action(request.user, 'HELPDESK_TICKET_CLOSED', f"Ticket {ticket.id} closed via stage", ticket)
            ticket.save()
            return Response(TicketSerializer(ticket).data)
        except Exception as e:
            return Response({'error': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def set_status(self, request, pk=None):
        """State-machine-validated status transition."""
        ticket = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'status is required'}, status=drf_status.HTTP_400_BAD_REQUEST)
        try:
            TicketService.update_status(request, ticket, new_status)
            return Response({'status': new_status})
        except Exception as e:
            return Response({'error': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """Adds a reply to a ticket thread."""
        ticket = self.get_object()
        body = request.data.get('body')
        if not body:
            return Response({'error': 'body is required'}, status=drf_status.HTTP_400_BAD_REQUEST)
        message = TicketMessageService.add_message(request, ticket, body)
        return Response(TicketMessageSerializer(message).data, status=drf_status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def link_article(self, request, pk=None):
        """Links an existing KB article to the ticket."""
        ticket = self.get_object()
        article_id = request.data.get('article_id')
        if not article_id:
            return Response({'error': 'article_id is required'}, status=drf_status.HTTP_400_BAD_REQUEST)
        try:
            TicketService.link_kb_article(request, ticket, article_id)
            return Response({'status': 'linked'})
        except Exception as e:
            return Response({'error': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def escalate(self, request, pk=None):
        """Escalates a support ticket to an ITSM Problem."""
        ticket = self.get_object()
        try:
            TicketService.escalate_to_problem(request, ticket)
            from apps.core.services.audit import AuditService
            AuditService.log_action(request.user, 'HELPDESK_TICKET_ESCALATED', f"Ticket {ticket.id} escalated", ticket)
            return Response({'status': 'escalated', 'problem_id': ticket.problem.id})
        except Exception as e:
            return Response({'error': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def create_kb_from_ticket(self, request, pk=None):
        """Converts the ticket to a KB article."""
        ticket = self.get_object()
        try:
            article = TicketService.convert_ticket_to_kb(request, ticket)
            return Response(KnowledgeArticleSerializer(article).data, status=drf_status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)


class KnowledgeArticleViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = KnowledgeArticleSerializer
    queryset = KnowledgeArticle.objects.filter(is_deleted=False)

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if getattr(self.request.user, 'is_staff', False) and not tenant:
            return self.queryset
        if tenant:
            return self.queryset.filter(tenant=tenant)
        return self.queryset.none()

class HelpdeskTeamViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HelpdeskTeamSerializer
    
    def get_queryset(self):
        return HelpdeskTeam.objects.filter(tenant=self.request.user.tenant)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class HelpdeskStageViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HelpdeskStageSerializer
    
    def get_queryset(self):
        return HelpdeskStage.objects.filter(tenant=self.request.user.tenant).order_by('sequence')
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class HelpdeskTagViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HelpdeskTagSerializer
    
    def get_queryset(self):
        return HelpdeskTag.objects.filter(tenant=self.request.user.tenant)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class SlaPolicyViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SlaPolicySerializer
    
    def get_queryset(self):
        return SlaPolicy.objects.filter(tenant=self.request.user.tenant)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class SupportReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        from apps.helpdesk.domain.models import Ticket
        from django.utils import timezone
        from datetime import timedelta
        tickets = Ticket.objects.all()
        if tenant: tickets = tickets.filter(tenant=tenant)
        
        open_t = tickets.filter(status__in=['open', 'in_progress']).count()
        closed_t = tickets.filter(status='resolved').count()
        resolved_qs = tickets.filter(status='resolved')
        
        avg_res_hrs = 0
        sla_met_count = 0
        total_res_hours = 0
        for t in resolved_qs:
            if t.resolved_at and t.created_at:
                hours = (t.resolved_at - t.created_at).total_seconds() / 3600.0
                total_res_hours += hours
                if hours <= 48:
                    sla_met_count += 1
                    
        if closed_t > 0:
            avg_res_hrs = round(total_res_hours / closed_t, 1)
            
        result = {
            "open": open_t,
            "avg_resolution_time_hrs": avg_res_hrs,
            "total_tickets": tickets.count(),
            "resolved_tickets": closed_t,
            "sla_compliance_rate": round((sla_met_count / closed_t * 100), 1) if closed_t > 0 else 100,
        }
        return Response({"status": "success", "data": result})

class ExportSupportCSV(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        import csv
        from django.http import HttpResponse
        from apps.helpdesk.domain.models import Ticket
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="support_export.csv"'
        writer = csv.writer(response)
        tenant = getattr(request, 'tenant', None)
        writer.writerow(['Status', 'Count'])
        tickets = Ticket.objects.all()
        if tenant: tickets = tickets.filter(tenant=tenant)
        writer.writerow(['Open Tickets', tickets.filter(status__in=['open', 'in_progress']).count()])
        writer.writerow(['Resolved Tickets', tickets.filter(status='resolved').count()])
        return response

