from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..domain.models import PortalAccess, PortalShare
from .serializers import PortalAccessSerializer, PortalShareSerializer

class PortalAccessViewSet(viewsets.ModelViewSet):
    queryset = PortalAccess.objects.all()
    serializer_class = PortalAccessSerializer
    permission_classes = [IsAuthenticated]

class PortalShareViewSet(viewsets.ModelViewSet):
    queryset = PortalShare.objects.all()
    serializer_class = PortalShareSerializer
    permission_classes = [IsAuthenticated]

class PortalDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from apps.crm.domain.models import Client
        from apps.accounting.domain.models import Invoice
        from apps.helpdesk.domain.models import Ticket
        from apps.sale.domain.models import SaleOrder
        from apps.projects.domain.models import Project, Task
        from apps.contracts.domain.models import ServiceContract
        from apps.billing.domain.models import Subscription
        from apps.maintenance.domain.models import Asset
        
        client = Client.objects.filter(contacts__user=request.user).first()
        if not client:
            return Response({'error': 'No client profile found for your user.'}, status=404)
            
        # 1. Accounting
        invoices = Invoice.objects.filter(client=client).order_by('-issue_date')
        
        # 2. Support Tickets
        tickets = Ticket.objects.filter(created_by=request.user).order_by('-created_at')
        
        # 3. Sale Orders / Quotes
        orders = SaleOrder.objects.filter(client=client).order_by('-date_order')
        
        # 4. Projects
        projects = Project.objects.filter(client=client).order_by('-created_at')
        
        # 5. Contracts
        contracts = ServiceContract.objects.filter(client=client).order_by('-start_date')
        
        # 6. SaaS Subscriptions (Billing)
        # Note: Subscriptions might not have a direct client link but might be linked via tenant
        # If subscription has no client, we can match by user
        subscriptions = Subscription.objects.filter(user=request.user).order_by('-created_at')
        
        # 7. Assets / Endpoints
        assets = Asset.objects.filter(client=client).order_by('-created_at')
        
        return Response({
            'client': {'id': client.id, 'name': client.name},
            
            # Aggregated Counts for the grid
            'counts': {
                'invoices': invoices.count(),
                'tickets': tickets.count(),
                'orders': orders.count(),
                'projects': projects.count(),
                'contracts': contracts.count(),
                'subscriptions': subscriptions.count(),
                'maintenance': assets.count(),
            },
            
            # Additional logic for specific statuses (like Odoo's "3 To Pay", "1 Open")
            'open_invoices': invoices.filter(status='sent').count(),
            'open_tickets': tickets.filter(status='open').count(),
            'active_contracts': contracts.filter(status='active').count(),
            
            # Recent items for the quick lists
            'recent_invoices': [{'id': i.id, 'number': str(i.invoice_number or i.id), 'amount': str(i.amount_total), 'status': i.status, 'date': str(i.issue_date)} for i in invoices[:5]],
            'recent_tickets': [{'id': t.id, 'subject': t.subject, 'status': t.status, 'date': str(t.created_at.date())} for t in tickets[:5]],
            'recent_orders': [{'id': o.id, 'number': str(o.order_number), 'amount': str(o.amount_total), 'status': o.status, 'date': str(o.date_order)} for o in orders[:5]],
            'recent_projects': [{'id': p.id, 'name': p.name, 'status': p.status} for p in projects[:5]],
        })

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
