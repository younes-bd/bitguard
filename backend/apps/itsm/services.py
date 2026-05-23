from django.utils import timezone
from django.conf import settings
from .models import ChangeRequest, ServiceItem, ServiceRequest
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from apps.support.models import Ticket
from apps.approvals.models import ApprovalRequest, ApprovalStep

class ITSMService(BaseService):
    @staticmethod
    def submit_change(change_request):
        """Move from draft to submitted for review."""
        if change_request.status == 'draft':
            change_request.status = 'submitted'
            change_request.save()
        return change_request

    @staticmethod
    def approve_change(change_request, user):
        """Elevate a CR via executive approval."""
        change_request.status = 'approved'
        change_request.approved_by = user
        change_request.save()
        return change_request

    @staticmethod
    def reject_change(change_request, user):
        """Reject a submitted change."""
        change_request.status = 'rejected'
        change_request.save()
        return change_request

    @staticmethod
    def progress_change(change_request):
        """Mark CR as engaged in active deployment architecture."""
        change_request.status = 'in_progress'
        change_request.save()
        return change_request

    @staticmethod
    def complete_change(change_request):
        """Mark CR as successfully implemented."""
        change_request.status = 'completed'
        change_request.save()
        return change_request

    @staticmethod
    def fail_change(change_request):
        """Mark CR as failed implementation."""
        change_request.status = 'failed'
        change_request.save()
        return change_request

    @staticmethod
    def rollback_change(change_request):
        """Mark CR as rolled back after failure."""
        change_request.status = 'rolled_back'
        change_request.save()
        return change_request

    # IT Service Catalog & Workflows
    @classmethod
    def create_service_request(cls, service_item, requester, form_data, request=None):
        tenant = cls.get_tenant_context(request)
        
        req = ServiceRequest.objects.create(
            tenant=tenant,
            service_item=service_item,
            requester=requester,
            form_data=form_data,
            status='pending_approval' if service_item.approval_required else 'in_progress'
        )
        
        AuditService.log_action(request, action="SERVICE_REQUEST_CREATED", resource=f"itsm.ServiceRequest:{req.pk}", payload=form_data)
        
        if service_item.approval_required:
            # Spawn ApprovalRequest
            app_req = ApprovalRequest.objects.create(
                tenant=tenant,
                title=f"Approval Required: {service_item.name} for {requester.username}",
                request_type='access',
                requester=requester,
                status='pending',
                payload={"service_request_id": str(req.pk)}
            )
            # Create a default step pointing to service owner
            if service_item.service_owner:
                ApprovalStep.objects.create(
                    tenant=tenant,
                    approval_request=app_req,
                    step_order=1,
                    approver=service_item.service_owner,
                    status='pending'
                )
        else:
            # Spawn support ticket directly
            cls.fulfill_service_request(req, request)
            
        return req

    @classmethod
    def fulfill_service_request(cls, service_request, request=None):
        tenant = cls.get_tenant_context(request)
        
        # Spawn Support Ticket
        ticket = Ticket.objects.create(
            tenant=tenant,
            title=f"[REQ-{service_request.pk}] {service_request.service_item.name}",
            description=f"Automated Service Request for {service_request.requester.username}.\n\nForm Input Data:\n{service_request.form_data}",
            status='open',
            priority='medium',
            customer=service_request.requester,
            assigned_to=service_request.service_item.service_owner
        )
        
        service_request.ticket = ticket
        service_request.status = 'in_progress'
        service_request.save()
        
        AuditService.log_action(request, action="SERVICE_REQUEST_FULFILLMENT_STARTED", resource=f"itsm.ServiceRequest:{service_request.pk}", payload={"ticket_id": str(ticket.pk)})
        return ticket

    @classmethod
    def approve_service_request(cls, service_request, user, request=None):
        service_request.status = 'approved'
        service_request.save()
        AuditService.log_action(request, action="SERVICE_REQUEST_APPROVED", resource=f"itsm.ServiceRequest:{service_request.pk}", payload={"approved_by": user.username})
        cls.fulfill_service_request(service_request, request)
        return service_request

    @classmethod
    def reject_service_request(cls, service_request, user, request=None):
        service_request.status = 'rejected'
        service_request.closed_at = timezone.now()
        service_request.save()
        AuditService.log_action(request, action="SERVICE_REQUEST_REJECTED", resource=f"itsm.ServiceRequest:{service_request.pk}", payload={"rejected_by": user.username})
        return service_request
