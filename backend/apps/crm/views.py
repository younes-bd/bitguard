"""
CRM Views — Charter §8, §9 Compliant
Views orchestrate; services decide. All logic delegated to CRM service layer.
"""
from rest_framework import viewsets, serializers as drf_serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Client, Contact, Lead, Deal, Activity
from .serializers import (
    ClientSerializer, ContactSerializer, LeadSerializer,
    DealSerializer, ActivitySerializer,
)
from .services import ClientService, ContactService, LeadService, DealService, ActivityService


class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ClientSerializer

    def get_queryset(self):
        return ClientService.get_queryset(self.request)

    def perform_create(self, serializer):
        ClientService.create_client(self.request, serializer.validated_data)

    def perform_update(self, serializer):
        ClientService.update_client(self.request, self.get_object(), serializer.validated_data)

    def perform_destroy(self, instance):
        ClientService.delete_client(self.request, instance)

    @action(detail=True, methods=['post'])
    def transition(self, request, pk=None):
        """Explicitly transition a client lifecycle status."""
        client = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            updated = ClientService.update_client(request, client, {'status': new_status})
            return Response(ClientSerializer(updated).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ContactViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ContactSerializer

    def get_queryset(self):
        return ContactService.get_queryset(self.request)


class LeadViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LeadSerializer

    def get_queryset(self):
        return LeadService.get_queryset(self.request)

    def perform_create(self, serializer):
        LeadService.create_lead(self.request, serializer.validated_data)


class DealViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DealSerializer

    def get_queryset(self):
        return DealService.get_queryset(self.request)

    def perform_create(self, serializer):
        DealService.create_deal(self.request, serializer.validated_data)

    def perform_update(self, serializer):
        DealService.update_deal(self.request, self.get_object(), serializer.validated_data)


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return ActivityService.get_queryset(self.request)