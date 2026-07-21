from django.utils import timezone
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from ..domain.models import ApprovalRequest, ApprovalStep

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
        
        # Downstream Triggers
        payload = request_obj.payload or {}
        if request_obj.request_type == 'purchase' and 'po_id' in payload:
            from apps.purchase.domain.models import PurchaseOrder
            try:
                po = PurchaseOrder.objects.get(id=payload['po_id'])
                po.status = 'confirmed'
                po.approved_by = user
                po.save()
            except PurchaseOrder.DoesNotExist:
                pass
        elif request_obj.request_type == 'expense' and 'expense_id' in payload:
            from apps.accounting.domain.models import Expense
            try:
                exp = Expense.objects.get(id=payload['expense_id'])
                exp.status = 'approved'
                exp.save()
            except Expense.DoesNotExist:
                pass
                
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
        
        # Downstream Triggers
        payload = request_obj.payload or {}
        if request_obj.request_type == 'purchase' and 'po_id' in payload:
            from apps.purchase.domain.models import PurchaseOrder
            try:
                po = PurchaseOrder.objects.get(id=payload['po_id'])
                po.status = 'cancelled'
                po.save()
            except PurchaseOrder.DoesNotExist:
                pass
        elif request_obj.request_type == 'expense' and 'expense_id' in payload:
            from apps.accounting.domain.models import Expense
            try:
                exp = Expense.objects.get(id=payload['expense_id'])
                exp.status = 'rejected'
                exp.save()
            except Expense.DoesNotExist:
                pass
                
        return request_obj
