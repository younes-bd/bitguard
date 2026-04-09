"""
Support Service Layer — Charter §8, §11 Compliance
Helpdesk Ticketing with tenant isolation and full audit tracing.
"""
from django.db import transaction
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import Ticket, TicketMessage, KnowledgeArticle


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
        
        # Cross-module SLA matching
        from apps.crm.models import Contact
        from apps.contracts.models import ServiceContract
        from django.utils import timezone
        import datetime
        
        # Attempt to find the user's client via Contact email
        contact = Contact.objects.filter(email=request.user.email).first()
        if contact and contact.client:
            # Find active contract for this client
            contract = ServiceContract.objects.filter(
                client=contact.client, status='active'
            ).select_related('sla_tier').first()
            
            if contract and contract.sla_tier:
                ticket.due_date = timezone.now() + datetime.timedelta(hours=contract.sla_tier.resolution_hours)

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

    @classmethod
    @transaction.atomic
    def link_kb_article(cls, request, ticket: Ticket, article_id: str) -> Ticket:
        cls.validate_ownership(ticket, request)
        article = KnowledgeArticle.objects.get(id=article_id, tenant=cls.get_tenant_context(request))
        ticket.related_articles.add(article)
        
        AuditService.log_action(
            request,
            action="SUPPORT_TICKET_LINKED_KB",
            resource=f"support.Ticket:{ticket.pk}",
            payload={"article_id": str(article.id), "article_title": article.title},
        )
        return ticket

    @classmethod
    @transaction.atomic
    def convert_ticket_to_kb(cls, request, ticket: Ticket) -> KnowledgeArticle:
        cls.validate_ownership(ticket, request)
        if ticket.is_converted_to_kb:
            raise ValueError("Ticket has already been converted to a Knowledge Base article.")
            
        tenant = cls.get_tenant_context(request)
        
        # Combine ticket description and resolution messages (if any) into content
        messages = ticket.messages.all().order_by('created_at')
        content = f"<h3>Problem:</h3><p>{ticket.description}</p>"
        
        if messages.exists():
            content += "<h3>Resolution/Discussion:</h3>"
            for msg in messages:
                content += f"<p><strong>{msg.sender.username if msg.sender else 'System'}:</strong> {msg.body}</p>"

        article = KnowledgeArticle.objects.create(
            tenant=tenant,
            title=f"KB: {ticket.title}",
            category=ticket.priority, # Default category to priority or something similar
            content=content
        )
        
        ticket.is_converted_to_kb = True
        ticket.related_articles.add(article)
        ticket.save(update_fields=['is_converted_to_kb'])
        
        AuditService.log_action(
            request,
            action="SUPPORT_TICKET_CONVERTED_TO_KB",
            resource=f"support.Ticket:{ticket.pk}",
            payload={"new_article_id": str(article.id)},
        )
        return article


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
