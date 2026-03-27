"""
CRM Service Layer — Charter §8 Compliance
All business logic lives here; views orchestrate, services decide.
"""
from django.db import transaction
from django.db.models import Sum
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from apps.core.signals import lifecycle_transition
from .models import Client, Contact, Lead, Deal, Activity


class ClientService(BaseService):
    """Manages the CRM Client lifecycle per Charter §15."""

    @classmethod
    def get_queryset(cls, request):
        """Returns a tenant-scoped, non-deleted queryset."""
        return cls.filter_by_context(Client.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_client(cls, request, data: dict) -> Client:
        tenant = cls.get_tenant_context(request)
        client = Client(tenant=tenant, **data)
        client.full_clean()
        client.save()
        AuditService.log_action(
            request,
            action="CRM_CLIENT_CREATED",
            resource=f"crm.Client:{client.pk}",
            payload={"name": client.name, "status": client.status},
        )
        return client

    @classmethod
    @transaction.atomic
    def update_client(cls, request, client: Client, data: dict) -> Client:
        cls.validate_ownership(client, request)
        old_status = client.status
        for field, value in data.items():
            setattr(client, field, value)
        client.full_clean()
        client.save()

        # Emit lifecycle event if status changed
        new_status = client.status
        if old_status != new_status:
            lifecycle_transition.send(
                sender=Client,
                client=client,
                old_status=old_status,
                new_status=new_status,
                request=request,
            )

        AuditService.log_action(
            request,
            action="CRM_CLIENT_UPDATED",
            resource=f"crm.Client:{client.pk}",
            payload={"changes": data},
        )
        return client

    @classmethod
    @transaction.atomic
    def delete_client(cls, request, client: Client):
        cls.validate_ownership(client, request)
        client.delete()  # Soft delete via SoftDeleteModel
        AuditService.log_action(
            request,
            action="CRM_CLIENT_DELETED",
            resource=f"crm.Client:{client.pk}",
            payload={"name": client.name},
        )

    @staticmethod
    def get_client_dashboard(request, client):
        """
        Retrieves aggregated dashboard data for a client, 
        including Support, Projects, Contracts and Store financial data.
        """
        from apps.support.models import Ticket
        from apps.projects.models import Project
        from apps.contracts.models import ServiceContract
        from apps.store.models import Order
        
        # Note: Serializers should be imported here or at top level if no circular dependency
        # For simplicity in this merge, we'll assume they are available via standard paths
        
        tickets = Ticket.objects.filter(tenant=client.tenant, customer__email__in=client.contacts.values_list('email', flat=True)).order_by('-created_at')[:5]
        projects = Project.objects.filter(client=client).order_by('-created_at')[:5]
        contracts = client.contracts.filter(status='active')
        
        # Cross-app data: Find users associated with this client's contacts
        contact_emails = client.contacts.values_list('email', flat=True)
        
        # Fetch recent orders from Store
        recent_orders = Order.objects.filter(user__email__in=contact_emails).order_by('-created_at')[:5]
        total_spent = Order.objects.filter(user__email__in=contact_emails).aggregate(total=Sum('amount'))['total'] or 0
        
        return {
            'client_id': str(client.id),
            'name': client.name,
            'status': client.status,
            'recent_tickets_count': tickets.count(),
            'active_projects_count': projects.count(),
            'active_contracts_count': contracts.count(),
            'store_summary': {
                'recent_orders_count': recent_orders.count(),
                'total_spent': float(total_spent)
            }
        }


class DealService(BaseService):
    """Manages CRM Deals; winning a deal triggers ERP obligation (via signals)."""

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Deal.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_deal(cls, request, data: dict) -> Deal:
        tenant = cls.get_tenant_context(request)
        deal = Deal(tenant=tenant, **data)
        deal.full_clean()
        deal.save()
        AuditService.log_action(
            request,
            action="CRM_DEAL_CREATED",
            resource=f"crm.Deal:{deal.pk}",
            payload={"title": deal.title, "stage": deal.stage, "amount": float(deal.amount)},
        )
        return deal

    @classmethod
    @transaction.atomic
    def update_deal(cls, request, deal: Deal, data: dict) -> Deal:
        cls.validate_ownership(deal, request)
        for field, value in data.items():
            setattr(deal, field, value)
        deal.full_clean()
        deal.save()
        # Note: post_save signal on Deal.stage='won' auto-creates InternalProject in ERP
        AuditService.log_action(
            request,
            action="CRM_DEAL_UPDATED",
            resource=f"crm.Deal:{deal.pk}",
            payload={"changes": data},
        )
        return deal


class LeadService(BaseService):
    """Manages CRM Leads."""

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Lead.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_lead(cls, request, data: dict) -> Lead:
        tenant = cls.get_tenant_context(request)
        lead = Lead(tenant=tenant, **data)
        lead.full_clean()
        lead.save()
        AuditService.log_action(
            request,
            action="CRM_LEAD_CREATED",
            resource=f"crm.Lead:{lead.pk}",
            payload={"title": lead.title, "status": lead.status},
        )
        return lead


class ContactService(BaseService):
    """Manages CRM Contacts."""

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Contact.objects.all(), request)


class ActivityService(BaseService):
    """Manages CRM Activities (calls, emails, meetings, notes)."""

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Activity.objects.all(), request)
