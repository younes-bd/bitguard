from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import (
    Client, Ticket, Contract, Project, ActivityLog, 
    Contact, Deal, Interaction
)
from .serializers import (
    ClientSerializer, TicketSerializer, ContractSerializer, ProjectSerializer, 
    ActivityLogSerializer, ContactSerializer, DealSerializer, InteractionSerializer
)
from apps.store.models import Order
from apps.store.serializers import OrderSerializer

from .services import CustomerService
from apps.core.permissions import ConstitutionPermission
from apps.core.services.audit import AuditService

class ClientViewSet(viewsets.ModelViewSet):
    """
    Manage Clients (Companies/Individuals).
    Charter Compliance: Section 13 (Control Plane), Section 21 (Permissions).
    """
    queryset = Client.objects.all().order_by('-created_at')
    serializer_class = ClientSerializer
    permission_classes = [ConstitutionPermission] # Section 21
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'company_name', 'email', 'phone']

    def perform_create(self, serializer):
        # Section 11: Audit Trail
        client = serializer.save(account_manager=self.request.user)
        AuditService.log(
            self.request,
            action="CLIENT_CREATED",
            resource=f"crm.Client:{client.pk}",
            payload=serializer.data
        )

    def perform_update(self, serializer):
        # Section 11 & 15: Audit Trail & Lifecycle
        old_instance = self.get_object()
        old_status = old_instance.status
        client = serializer.save()
        
        # Check for status change specifically for Section 15
        if 'status' in serializer.validated_data and old_status != client.status:
             CustomerService.update_lifecycle(self.request.user, client.status, request=self.request)

        AuditService.log(
            self.request,
            action="CLIENT_UPDATED",
            resource=f"crm.Client:{client.pk}",
            payload=serializer.data
        )

    def perform_destroy(self, instance):
        # Section 11: Audit Trail
        resource_ref = f"crm.Client:{instance.pk}"
        instance.delete()
        AuditService.log(
            self.request,
            action="CLIENT_DELETED",
            resource=resource_ref,
            payload={"deleted_id": instance.pk}
        )

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        """
        Get aggregated data for a specific client (Tickets, Projects, etc.)
        """
        client = self.get_object()
        data = CustomerService.get_client_dashboard(client)
        return Response(data)

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    permission_classes = [ConstitutionPermission] # Section 21
    filter_backends = [filters.SearchFilter]
    search_fields = ['summary', 'description', 'client__name']

    def perform_create(self, serializer):
        ticket = serializer.save(created_by=self.request.user)
        AuditService.log(
            self.request,
            action="TICKET_CREATED",
            resource=f"crm.Ticket:{ticket.pk}",
            payload=serializer.data
        )

    def perform_update(self, serializer):
        ticket = serializer.save()
        AuditService.log(
            self.request,
            action="TICKET_UPDATED",
            resource=f"crm.Ticket:{ticket.pk}",
            payload=serializer.data
        )

    def perform_destroy(self, instance):
        resource_ref = f"crm.Ticket:{instance.pk}"
        instance.delete()
        AuditService.log(
            self.request,
            action="TICKET_DELETED",
            resource=resource_ref,
            payload={"deleted_id": instance.pk}
        )

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().order_by('-start_date')
    serializer_class = ContractSerializer
    permission_classes = [ConstitutionPermission] # Section 21

    def perform_create(self, serializer):
        contract = serializer.save()
        AuditService.log(
            self.request,
            action="CONTRACT_CREATED",
            resource=f"crm.Contract:{contract.pk}",
            payload=serializer.data
        )

    def perform_update(self, serializer):
        contract = serializer.save()
        AuditService.log(
            self.request,
            action="CONTRACT_UPDATED",
            resource=f"crm.Contract:{contract.pk}",
            payload=serializer.data
        )

    def perform_destroy(self, instance):
        resource_ref = f"crm.Contract:{instance.pk}"
        instance.delete()
        AuditService.log(
            self.request,
            action="CONTRACT_DELETED",
            resource=resource_ref,
            payload={"deleted_id": instance.pk}
        )

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-start_date')
    serializer_class = ProjectSerializer
    permission_classes = [ConstitutionPermission] # Section 21

    def perform_create(self, serializer):
        project = serializer.save()
        AuditService.log(
            self.request,
            action="PROJECT_CREATED",
            resource=f"crm.Project:{project.pk}",
            payload=serializer.data
        )

    def perform_update(self, serializer):
        project = serializer.save()
        AuditService.log(
            self.request,
            action="PROJECT_UPDATED",
            resource=f"crm.Project:{project.pk}",
            payload=serializer.data
        )

    def perform_destroy(self, instance):
        resource_ref = f"crm.Project:{instance.pk}"
        instance.delete()
        AuditService.log(
            self.request,
            action="PROJECT_DELETED",
            resource=resource_ref,
            payload={"deleted_id": instance.pk}
        )

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().order_by('-timestamp')
    serializer_class = ActivityLogSerializer
    permission_classes = [ConstitutionPermission] # Section 21

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [ConstitutionPermission] # Section 21

class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all().order_by('-created_at')
    serializer_class = DealSerializer
    permission_classes = [ConstitutionPermission] # Section 21

    def perform_create(self, serializer):
        deal = serializer.save()
        AuditService.log(
            self.request,
            action="DEAL_CREATED",
            resource=f"crm.Deal:{deal.pk}",
            payload=serializer.data
        )

    def perform_update(self, serializer):
        deal = serializer.save()
        AuditService.log(
            self.request,
            action="DEAL_UPDATED",
            resource=f"crm.Deal:{deal.pk}",
            payload=serializer.data
        )

    def perform_destroy(self, instance):
        resource_ref = f"crm.Deal:{instance.pk}"
        instance.delete()
        AuditService.log(
            self.request,
            action="DEAL_DELETED",
            resource=resource_ref,
            payload={"deleted_id": instance.pk}
        )

class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all().order_by('-date')
    serializer_class = InteractionSerializer
    permission_classes = [ConstitutionPermission] # Section 21

class CrmOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only view of Store Orders for CRM context.
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [ConstitutionPermission] # Section 21