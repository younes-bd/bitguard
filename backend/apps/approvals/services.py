from django.utils import timezone
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import ApprovalRequest, ApprovalStep

class ApprovalService(BaseService):
    @staticmethod
    def submit_request(data, request):
        """
        Creates a new approval request alongside any immediate configuration processing.
        """
        user = request.user
        req = ApprovalRequest.objects.create(
            tenant=getattr(request, 'tenant', None),
            title=data.get('title'),
            request_type=data.get('request_type', 'other'),
            requester=user,
            payload=data.get('payload', {})
        )
        AuditService.log_action(request, "APPROVAL_SUBMITTED", f"approvals.ApprovalRequest:{req.id}", data)
        return req
        
    @staticmethod
    def approve(request_obj, request, comments=""):
        """
        Approve the request by the current user.
        """
        user = request.user
        request_obj.status = 'approved'
        request_obj.decided_by = user
        request_obj.decided_at = timezone.now()
        request_obj.comments = comments
        request_obj.save()
        AuditService.log_action(request, "APPROVAL_APPROVED", f"approvals.ApprovalRequest:{request_obj.id}", {"comments": comments})
        return request_obj

    @staticmethod
    def reject(request_obj, request, comments=""):
        """
        Reject the request by the current user.
        """
        user = request.user
        request_obj.status = 'rejected'
        request_obj.decided_by = user
        request_obj.decided_at = timezone.now()
        request_obj.comments = comments
        request_obj.save()
        AuditService.log_action(request, "APPROVAL_REJECTED", f"approvals.ApprovalRequest:{request_obj.id}", {"comments": comments})
        return request_obj
