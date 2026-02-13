from .models import Client, Ticket, Project, Contract
from .serializers import ClientSerializer, TicketSerializer, ProjectSerializer, ContractSerializer
from apps.core.services.base import BaseService

class CustomerService(BaseService):
    @staticmethod
    def get_client_dashboard(client):
        """
        Retrieves aggregated dashboard data for a client, 
        now including Store financial data.
        """
        from apps.store.models import Order
        from apps.store.serializers import OrderSerializer
        from .models import Contact

        tickets = Ticket.objects.filter(client=client).order_by('-created_at')[:5]
        projects = Project.objects.filter(client=client).order_by('-end_date')
        contracts = Contract.objects.filter(client=client).filter(is_active=True)
        
        # Cross-app data: Find users associated with this client's contacts
        contact_users = Contact.objects.filter(client=client, user__isnull=False).values_list('user_id', flat=True)
        
        # Fetch recent orders from Store
        recent_orders = Order.objects.filter(user_id__in=contact_users).order_by('-created_at')[:5]
        total_spent = sum(order.amount for order in Order.objects.filter(user_id__in=contact_users))
        
        return {
            'client': ClientSerializer(client).data,
            'recent_tickets': TicketSerializer(tickets, many=True).data,
            'active_projects': ProjectSerializer(projects, many=True).data,
            'active_contracts': ContractSerializer(contracts, many=True).data,
            'store_data': {
                'recent_orders': OrderSerializer(recent_orders, many=True).data,
                'total_spent': float(total_spent)
            }
        }

    @staticmethod
    def update_lifecycle(user, new_status, request=None):
        """
        Derives and updates the customer lifecycle stage.
        Charter Compliance: Section 15 (Customer Lifecycle Canon).
        """
        from .models import Client, ActivityLog
        
        client = Client.objects.filter(contacts__user=user).first()
        if not client:
            return None

        old_status = client.status
        if old_status != new_status:
            client.status = new_status
            client.save()
            
            # Log transition as mandated by Section 15
            ActivityLog.objects.create(
                client=client,
                user=user,
                action="LIFECYCLE_TRANSITION",
                details=f"Status changed from {old_status} to {new_status}"
            )
            
            if request:
                from apps.core.services.audit import AuditService
                AuditService.log(
                    request,
                    action="CUSTOMER_LIFECYCLE_UPDATED",
                    resource=f"crm.Client:{client.id}",
                    payload={"old_status": old_status, "new_status": new_status}
                )
        
        return client
