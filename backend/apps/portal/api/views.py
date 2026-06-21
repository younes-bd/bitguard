from rest_framework import permissions, status, views
from rest_framework.response import Response

class ClientDashboardView(views.APIView):
    """
    Aggregated data for the logged-in client (Workspaces, Tickets, Invoices, Projects, Contracts).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from apps.support.models import Ticket
        from apps.accounting.models import Invoice
        from apps.contracts.models import ServiceContract
        from apps.projects.models import Project
        from apps.users.models import TenantMembership
        
        # Identity linkage: Get all TenantMemberships for the current user
        memberships = TenantMembership.objects.filter(user=request.user, is_active=True).select_related('tenant', 'tenant__partner')
        
        if not memberships.exists():
            return Response({"error": "No tenant access found for this user."}, status=status.HTTP_404_NOT_FOUND)
            
        tenants = [m.tenant for m in memberships]
        tenant_ids = [t.id for t in tenants]
        
        # Extract partners from the allowed tenants
        partners = [t.partner for t in tenants if t.partner]
        partner_ids = [p.id for p in partners]
        
        # Resolve the crm.Client instances for these partners (since Invoices/Projects are linked to Client)
        from apps.crm.models import Client
        clients = Client.objects.filter(partner_id__in=partner_ids)
        client_ids = [c.id for c in clients]

        # Queries
        tickets = Ticket.objects.filter(customer=request.user).order_by('-created_at').values(
            'id', 'title', 'status', 'created_at', 'priority'
        )
        
        invoices = []
        projects = []
        contracts = []
        
        if client_ids:
            invoices = Invoice.objects.filter(client_id__in=client_ids).order_by('-issue_date').values(
                'id', 'invoice_number', 'total_amount', 'status', 'issue_date', 'due_date'
            )
            projects = Project.objects.filter(client_id__in=client_ids).order_by('-created_at').values(
                'id', 'name', 'status', 'progress_override', 'deadline'
            )
            contracts = ServiceContract.objects.filter(client_id__in=client_ids).order_by('-start_date').values(
                'id', 'title', 'status', 'amount', 'start_date', 'end_date'
            )
            
        tenant_data = [
            {
                "id": t.id, 
                "name": t.name, 
                "domain": t.domain, 
                "subscription_plan": t.subscription_plan, 
                "is_active": t.is_active, 
                "allowed_modules": t.allowed_modules
            } 
            for t in tenants
        ]
        
        # Format the client profile details
        primary_client = clients[0] if clients else None
        
        if primary_client:
            client_data = {
                "name": primary_client.name,
                "type": primary_client.client_type,
            }
        elif partners:
            client_data = {
                "name": partners[0].name,
                "type": partners[0].partner_type,
            }
        else:
            client_data = {
                "name": request.user.first_name or request.user.email,
                "type": "individual",
            }

        return Response({
            "client": client_data,
            "tickets": list(tickets),
            "invoices": list(invoices),
            "projects": list(projects),
            "contracts": list(contracts),
            "tenants": tenant_data
        })
