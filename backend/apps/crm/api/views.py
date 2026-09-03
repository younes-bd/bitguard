from apps.core.api.mixins import TenantScopedMixin
"""
CRM Views — Charter §8, §9 Compliant
Views orchestrate; services decide. All logic delegated to CRM service layer.
"""
from rest_framework import viewsets, serializers as drf_serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
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


from apps.core.api.mixins import ReportGenerateMixin

class ClientViewSet(ReportGenerateMixin, TenantScopedMixin, viewsets.ModelViewSet):
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

    @action(detail=True, methods=['get'], url_path='statement')
    def statement(self, request, pk=None):
        from django.apps import apps
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        client = self.get_object()
        period_start = request.query_params.get('period_start')
        period_end = request.query_params.get('period_end')
        
        invoices = []
        if apps.is_installed('apps.accounting'):
            from apps.accounting.services import AccountingService
            invoices = AccountingService.get_invoices_for_client(
                client, 
                status_exclude=['paid', 'void', 'cancelled'],
                period_start=period_start,
                period_end=period_end
            )
            invoices = invoices.order_by('issue_date')
            
        context = {
            'period_start': period_start,
            'period_end': period_end,
            'invoices': invoices,
        }
        
        template = ReportTemplate.objects.filter(
            tenant=request.user.tenant,
            model="crm.client",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, client, context_data=context)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        return Response({'url': attachment.file.url, 'filename': attachment.name})


    @action(detail=True, methods=['get'], url_path='portal-summary')
    def portal_summary(self, request, pk=None):
        from django.apps import apps
        client = self.get_object()
        try:
            open_tickets = 0
            if apps.is_installed('apps.helpdesk'):
                from apps.helpdesk.services import HelpdeskService
                open_tickets = HelpdeskService.get_open_tickets_for_client(client)
            
            overdue_invoices = 0
            if apps.is_installed('apps.accounting'):
                from apps.accounting.services import AccountingService
                overdue_invoices = AccountingService.get_overdue_invoices_for_client(client)
                
            active_contracts = 0
            if apps.is_installed('apps.subscriptions'):
                from apps.subscriptions.services import SubscriptionService
                active_contracts = SubscriptionService.get_active_contracts_for_client(client)
                
            assigned_assets = 0
            if apps.is_installed('apps.maintenance'):
                from apps.maintenance.services import MaintenanceService
                assigned_assets = MaintenanceService.get_assets_for_client(client)

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


class ContactViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ContactSerializer

    def get_queryset(self):
        return ContactService.get_queryset(self.request)


class LeadViewSet(TenantScopedMixin, viewsets.ModelViewSet):
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


class DealViewSet(TenantScopedMixin, viewsets.ModelViewSet):
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


class ActivityViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return ActivityService.get_queryset(self.request)

class CrmStageViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CrmStageSerializer
    
    def get_queryset(self):
        return super().get_queryset().order_by('sequence')

class CrmSalesTeamViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CrmSalesTeamSerializer

class LostReasonViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LostReasonSerializer

class CrmTagViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CrmTagSerializer

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.crm.domain.models import Deal, Lead, Activity
        from django.db.models import Sum
        tenant = getattr(request, 'tenant', None)
        
        deals = Deal.objects.filter(tenant=tenant)
        won_deals = deals.filter(status='won')
        total_revenue = won_deals.aggregate(Sum('expected_revenue'))['expected_revenue__sum'] or 0
        pipeline_value = deals.filter(status='open').aggregate(Sum('expected_revenue'))['expected_revenue__sum'] or 0
        
        return Response({
            'total_revenue': total_revenue,
            'pipeline_value': pipeline_value,
            'won_deals_count': won_deals.count(),
            'active_leads': Lead.objects.filter(tenant=tenant, status='new').count(),
            'recent_activities': Activity.objects.filter(tenant=tenant).order_by('-due_date')[:5].values('id', 'type', 'summary', 'due_date', 'status')
        })



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class CRMReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        from apps.crm.domain.models import Deal
        from django.db.models import Sum
        deals = Deal.objects.all()
        if tenant: deals = deals.filter(tenant=tenant)
        total = deals.count()
        won = deals.filter(stage__is_won=True).count()
        result = {
            "total_leads": total,
            "won_deals": won,
            "win_rate": round((won / total * 100), 1) if total > 0 else 0,
            "pipeline_value": float(deals.filter(stage__is_won=False).aggregate(t=Sum('expected_revenue'))['t'] or 0)
        }
        return Response({"status": "success", "data": result})

class ExportCRMCSV(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        import csv
        from django.http import HttpResponse
        from apps.crm.domain.models import Deal
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="crm_export.csv"'
        writer = csv.writer(response)
        tenant = getattr(request, 'tenant', None)
        writer.writerow(['Metric', 'Value'])
        deals = Deal.objects.all()
        if tenant: deals = deals.filter(tenant=tenant)
        writer.writerow(['Total Deals', deals.count()])
        writer.writerow(['Won Deals', deals.filter(stage__is_won=True).count()])
        return response

