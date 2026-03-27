"""
Support Service Layer — Charter §8, §11 Compliance
Helpdesk Ticketing with tenant isolation and full audit tracing.
"""
from django.db import transaction
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import Ticket, TicketMessage


class TicketService(BaseService):
    """Manages support Tickets with tenant scoping and audit logging."""

    VALID_STATUS_TRANSITIONS = {
        'open': ['in_progress', 'closed'],
        'in_progress': ['resolved', 'closed'],
        'resolved': ['closed', 'open'],  # Allow re-opening
        'closed': ['open'],
    }

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Ticket.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_ticket(cls, request, data: dict) -> Ticket:
        tenant = cls.get_tenant_context(request)
        ticket = Ticket(
            tenant=tenant,
            customer=request.user,
            **data,
        )
        ticket.full_clean()
        ticket.save()
        AuditService.log_action(
            request,
            action="SUPPORT_TICKET_CREATED",
            resource=f"support.Ticket:{ticket.pk}",
            payload={"title": ticket.title, "priority": ticket.priority},
        )
        return ticket

    @classmethod
    @transaction.atomic
    def resolve_ticket(cls, request, ticket: Ticket) -> Ticket:
        cls.validate_ownership(ticket, request)
        old_status = ticket.status
        ticket.status = 'resolved'
        ticket.save(update_fields=['status'])
        AuditService.log_action(
            request,
            action="SUPPORT_TICKET_RESOLVED",
            resource=f"support.Ticket:{ticket.pk}",
            payload={"old_status": old_status},
        )
        return ticket

    @classmethod
    @transaction.atomic
    def update_status(cls, request, ticket: Ticket, new_status: str) -> Ticket:
        cls.validate_ownership(ticket, request)
        current = ticket.status
        allowed = cls.VALID_STATUS_TRANSITIONS.get(current, [])
        if new_status not in allowed:
            from django.core.exceptions import ValidationError
            raise ValidationError(
                f"Invalid ticket status transition from '{current}' to '{new_status}'."
            )
        old_status = ticket.status
        ticket.status = new_status
        ticket.save(update_fields=['status'])
        AuditService.log_action(
            request,
            action="SUPPORT_TICKET_STATUS_CHANGED",
            resource=f"support.Ticket:{ticket.pk}",
            payload={"old": old_status, "new": new_status},
        )
        return ticket


class TicketMessageService(BaseService):
    """Manages messages/replies on support tickets."""

    @classmethod
    def get_queryset(cls, request):
        # Messages are scoped through their parent ticket tenant
        return TicketMessage.objects.filter(ticket__tenant=cls.get_tenant_context(request))

    @classmethod
    @transaction.atomic
    def add_message(cls, request, ticket: Ticket, body: str) -> TicketMessage:
        message = TicketMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            body=body,
        )
        # Auto-transition ticket from open to in_progress on first agent reply
        if ticket.status == 'open' and request.user.is_staff:
            ticket.status = 'in_progress'
            ticket.save(update_fields=['status'])
        return message
