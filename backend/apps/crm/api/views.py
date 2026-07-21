"""
CRM Views — Charter §8, §9 Compliant
Views orchestrate; services decide. All logic delegated to CRM service layer.
"""
from rest_framework import viewsets, serializers as drf_serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from ..domain.models import Client, Contact, Lead, Deal, Activity, CrmStage, CrmSalesTeam, LostReason, CrmTag
from ..api.serializers import (
    ClientSerializer, ContactSerializer, LeadSerializer,
    DealSerializer, ActivitySerializer, CrmStageSerializer,
    CrmSalesTeamSerializer, LostReasonSerializer, CrmTagSerializer
)
from ..application.services import ClientService, ContactService, LeadService, DealService, ActivityService


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

    @action(detail=True, methods=['get'], url_path='portal-summary')
    def portal_summary(self, request, pk=None):
        client = self.get_object()
        try:
            from apps.helpdesk.domain.models import Ticket
            from apps.accounting.domain.models import Invoice
            from apps.contracts.domain.models import ServiceContract
            from apps.itam.domain.models import Asset

            open_tickets = Ticket.objects.filter(client=client, status__in=['open', 'in_progress']).count()
            overdue_invoices = Invoice.objects.filter(client=client, status='overdue').count()
            active_contracts = ServiceContract.objects.filter(client=client, status='active').count()
            assigned_assets = Asset.objects.filter(client=client).count()

            return Response({
                'client_id': str(client.id),
                'client_name': client.name,
                'open_tickets': open_tickets,
                'overdue_invoices': overdue_invoices,
                'active_contracts': active_contracts,
                'assigned_assets': assigned_assets,
            })
        except Exception as e:
            return Response({
                'client_id': str(client.id),
                'client_name': client.name,
                'open_tickets': 0,
                'overdue_invoices': 0,
                'active_contracts': 0,
                'assigned_assets': 0,
            })


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

    @action(detail=True, methods=['post'], url_path='convert-to-sale')
    def convert_to_sale(self, request, pk=None):
        lead = self.get_object()
        from apps.sale.domain.models import SaleOrder
        from apps.sale.api.serializers import SaleOrderSerializer
        from django.utils import timezone
        
        client_ref = lead.contact.client if lead.contact else None
        if not client_ref:
            return Response({'error': 'Lead must be associated with a client to convert to sale.'}, status=status.HTTP_400_BAD_REQUEST)
            
        order = SaleOrder.objects.create(
            tenant=lead.tenant,
            client=client_ref,
            status='draft',
            order_number=f"SO-{timezone.now().year}-{SaleOrder.objects.filter(tenant=lead.tenant).count()+1:04d}",
            date_order=timezone.now().date(),
            created_by=request.user,
        )
        lead.status = 'converted'
        lead.save()
        return Response(SaleOrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def convert(self, request, pk=None):
        """Convert a lead into a Client and Deal."""
        lead = self.get_object()
        try:
            deal = LeadService.convert_lead(request, lead)
            return Response(DealSerializer(deal).data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='mark-lost')
    def mark_lost(self, request, pk=None):
        lead = self.get_object()
        lead.status = 'lost'
        lead.save()
        return Response(LeadSerializer(lead).data, status=status.HTTP_200_OK)


class DealViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DealSerializer

    def get_queryset(self):
        return DealService.get_queryset(self.request)

    def perform_create(self, serializer):
        DealService.create_deal(self.request, serializer.validated_data)

    def perform_update(self, serializer):
        DealService.update_deal(self.request, self.get_object(), serializer.validated_data)

    @action(detail=True, methods=['post'], url_path='convert-to-sale')
    def convert_to_sale(self, request, pk=None):
        deal = self.get_object()
        from apps.sale.domain.models import SaleOrder
        from apps.sale.api.serializers import SaleOrderSerializer
        from django.utils import timezone
        
        if not deal.client:
            return Response({'error': 'Deal must be associated with a client to convert to sale.'}, status=status.HTTP_400_BAD_REQUEST)
            
        order = SaleOrder.objects.create(
            tenant=deal.tenant,
            client=deal.client,
            status='draft',
            order_number=f"SO-{timezone.now().year}-{SaleOrder.objects.filter(tenant=deal.tenant).count()+1:04d}",
            date_order=timezone.now().date(),
            created_by=request.user,
        )
        deal.stage = 'won'
        deal.save()
        return Response(SaleOrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='set-stage')
    def set_stage(self, request, pk=None):
        deal = self.get_object()
        stage_id = request.data.get('stage_id')
        if not stage_id:
            return Response({'error': 'stage_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            stage = CrmStage.objects.get(id=stage_id, tenant=request.user.tenant)
            deal.stage = stage
            if stage.is_won:
                deal.status = 'won'
            elif stage.is_lost:
                deal.status = 'lost'
            deal.save()
            return Response(DealSerializer(deal).data, status=status.HTTP_200_OK)
        except CrmStage.DoesNotExist:
            return Response({'error': 'Invalid stage'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='mark-won')
    def mark_won(self, request, pk=None):
        deal = self.get_object()
        deal.status = 'won'
        won_stage = CrmStage.objects.filter(tenant=request.user.tenant, is_won=True).first()
        if won_stage:
            deal.stage = won_stage
        deal.save()
        return Response(DealSerializer(deal).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='mark-lost')
    def mark_lost(self, request, pk=None):
        deal = self.get_object()
        deal.status = 'lost'
        lost_reason_id = request.data.get('lost_reason_id')
        if lost_reason_id:
            try:
                reason = LostReason.objects.get(id=lost_reason_id, tenant=request.user.tenant)
                deal.lost_reason = reason
            except LostReason.DoesNotExist:
                pass
        lost_stage = CrmStage.objects.filter(tenant=request.user.tenant, is_lost=True).first()
        if lost_stage:
            deal.stage = lost_stage
        deal.save()
        return Response(DealSerializer(deal).data, status=status.HTTP_200_OK)


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return ActivityService.get_queryset(self.request)

class CrmStageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CrmStageSerializer
    
    def get_queryset(self):
        return CrmStage.objects.filter(tenant=self.request.user.tenant).order_by('sequence')
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class CrmSalesTeamViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CrmSalesTeamSerializer
    
    def get_queryset(self):
        return CrmSalesTeam.objects.filter(tenant=self.request.user.tenant)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class LostReasonViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LostReasonSerializer
    
    def get_queryset(self):
        return LostReason.objects.filter(tenant=self.request.user.tenant)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class CrmTagViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CrmTagSerializer
    
    def get_queryset(self):
        return CrmTag.objects.filter(tenant=self.request.user.tenant)
        
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)
