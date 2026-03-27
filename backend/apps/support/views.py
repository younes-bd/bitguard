"""
Support Views — Charter §8, §9 Compliant
Ticket views delegate all mutations to TicketService.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as drf_status
from .models import Ticket, TicketMessage
from .serializers import TicketSerializer, TicketMessageSerializer
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
