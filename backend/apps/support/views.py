"""
Support Views — Charter §8, §9 Compliant
Ticket views delegate all mutations to TicketService.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as drf_status
from .models import Ticket, TicketMessage, KnowledgeArticle
from .serializers import TicketSerializer, TicketMessageSerializer, KnowledgeArticleSerializer
from .services import TicketService, TicketMessageService


class TicketViewSet(viewsets.ModelViewSet):
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
        return Response({'status': 'resolved'})

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
    def create_kb_from_ticket(self, request, pk=None):
        """Converts the ticket to a KB article."""
        ticket = self.get_object()
        try:
            article = TicketService.convert_ticket_to_kb(request, ticket)
            return Response(KnowledgeArticleSerializer(article).data, status=drf_status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)


class KnowledgeArticleViewSet(viewsets.ModelViewSet):
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
