from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..domain.models import PortalAccess, PortalShare
from .serializers import PortalAccessSerializer, PortalShareSerializer

class PortalAccessViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PortalAccess.objects.all()
    serializer_class = PortalAccessSerializer
    permission_classes = [IsAuthenticated]

class PortalShareViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PortalShare.objects.all()
    serializer_class = PortalShareSerializer
    permission_classes = [IsAuthenticated]

class PortalDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from apps.portal.services import PortalDashboardService
        data = PortalDashboardService.get_dashboard_data(request.user)
        if not data:
            return Response({'error': 'No client profile found for your user.'}, status=404)
        return Response(data)

class PortalInvoiceListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from apps.crm.domain.models import Client
        from apps.accounting.domain.models import Invoice
        
        client = Client.objects.filter(contacts__user=request.user).first()
        if not client:
            return Response([])
            
        invoices = Invoice.objects.filter(client=client).order_by('-issue_date')
        return Response([{
            'id': i.id, 
            'number': str(i), 
            'amount': str(i.amount_total), 
            'status': i.status, 
            'due_date': str(i.due_date)
        } for i in invoices])

class PortalTicketListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from apps.helpdesk.domain.models import Ticket
        tickets = Ticket.objects.filter(created_by=request.user).order_by('-created_at')
        return Response([{
            'id': t.id,
            'subject': t.subject,
            'status': t.status,
            'priority': t.priority,
            'created_at': str(t.created_at.date())
        } for t in tickets])

    def post(self, request):
        from apps.helpdesk.domain.models import Ticket
        from apps.crm.domain.models import Client
        
        client = Client.objects.filter(contacts__user=request.user).first()
        
        ticket = Ticket.objects.create(
            subject=request.data.get('subject', 'Portal Request'),
            description=request.data.get('description', ''),
            priority=request.data.get('priority', 'medium'),
            created_by=request.user,
            client=client
        )
        return Response({
            'id': ticket.id,
            'subject': ticket.subject,
            'status': ticket.status,
            'priority': ticket.priority,
            'created_at': str(ticket.created_at.date())
        }, status=201)

class PortalOrderListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from apps.crm.domain.models import Client
        from apps.sale.domain.models import SaleOrder
        
        client = Client.objects.filter(contacts__user=request.user).first()
        if not client:
            return Response([])
            
        orders = SaleOrder.objects.filter(client=client).order_by('-date_order')
        return Response([{
            'id': o.id,
            'order_number': str(o.order_number),
            'amount': str(o.amount_total),
            'status': o.status,
            'date_order': str(o.date_order)
        } for o in orders])

class PortalProjectListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from apps.crm.domain.models import Client
        from apps.projects.domain.models import Project
        
        client = Client.objects.filter(contacts__user=request.user).first()
        if not client:
            return Response([])
            
        projects = Project.objects.filter(client=client).order_by('-created_at')
        return Response([{
            'id': p.id,
            'name': p.name,
            'status': p.status,
            'progress': getattr(p, 'progress', 0),
            'start_date': str(p.start_date) if p.start_date else None,
            'end_date': str(p.end_date) if p.end_date else None
        } for p in projects])

class PortalSubscriptionListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from apps.subscriptions.domain.models import Subscription
        subscriptions = Subscription.objects.filter(user=request.user).order_by('-created_at')
        return Response([{
            'id': s.id,
            'plan_name': s.plan_name if hasattr(s, 'plan_name') else 'Standard',
            'status': s.status,
            'amount': str(s.amount) if hasattr(s, 'amount') else '0.00',
            'next_billing_date': str(s.next_billing_date) if hasattr(s, 'next_billing_date') and s.next_billing_date else None
        } for s in subscriptions])

class PortalOrderDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        from apps.crm.domain.models import Client
        from apps.sale.domain.models import SaleOrder
        
        client = Client.objects.filter(contacts__user=request.user).first()
        if not client:
            return Response({'error': 'Client not found'}, status=404)
            
        try:
            order = SaleOrder.objects.get(pk=pk, client=client)
        except SaleOrder.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)
            
        return Response({
            'id': order.id,
            'order_number': str(order.order_number),
            'amount_total': str(order.amount_total),
            'status': order.status,
            'date_order': str(order.date_order)
        })

    def patch(self, request, pk):
        from apps.crm.domain.models import Client
        from apps.sale.domain.models import SaleOrder
        
        client = Client.objects.filter(contacts__user=request.user).first()
        if not client:
            return Response({'error': 'Client not found'}, status=404)
            
        try:
            order = SaleOrder.objects.get(pk=pk, client=client)
        except SaleOrder.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)
            
        action = request.data.get('action')
        if action == 'accept':
            order.status = 'sale'
            order.save()
            return Response({'status': order.status})
            
        return Response({'error': 'Invalid action'}, status=400)

