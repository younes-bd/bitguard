from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Client, Ticket, Contract, Project, ActivityLog, Contact, Deal, Interaction
from .serializers import (
    ClientSerializer, TicketSerializer, ContractSerializer, 
    ProjectSerializer, ActivityLogSerializer, ContactSerializer,
    DealSerializer, InteractionSerializer
)
from apps.erp.models import Invoice
from apps.erp.serializers import InvoiceSerializer
from apps.store.models import Order
from apps.store.serializers import OrderSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by('-created_at')
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        client = self.get_object()
        # Find all users linked to this client via contacts
        contact_users = client.contacts.filter(user__isnull=False).values_list('user', flat=True)
        orders = Order.objects.filter(user__in=contact_users).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def invoices(self, request, pk=None):
        client = self.get_object()
        invoices = Invoice.objects.filter(client=client).order_by('-issue_date')
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-updated_at')
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().order_by('-timestamp')
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by('last_name')
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all().order_by('-created_at')
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all().order_by('-date')
    serializer_class = InteractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CrmOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only view of all Store Orders for CRM context.
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

from apps.crm.models import Quote
from apps.crm.serializers import QuoteSerializer
# Import functionality from root workflow_logic (assuming it's in path)
try:
    from workflow_logic import convert_quote_to_invoice
except ImportError:
    # Fallback if path issues, though typically root is in path
    convert_quote_to_invoice = None

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all().order_by('-created_at')
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        quote = self.get_object()
        if quote.status not in ['sent', 'draft']:
            return Response({'error': 'Quote already processed or not in valid state'}, status=status.HTTP_400_BAD_REQUEST)
        
        quote.status = 'accepted'
        quote.save()
        
        # Trigger Conversion
        invoice = None
        if convert_quote_to_invoice:
            invoice = convert_quote_to_invoice(quote)
        
        data = {'status': 'accepted'}
        if invoice:
            data['invoice_id'] = invoice.id
            
        return Response(data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        quote = self.get_object()
        quote.status = 'rejected'
        quote.save()
        return Response({'status': 'rejected'})
