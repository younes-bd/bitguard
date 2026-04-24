from django.utils import timezone
from .models import Employee, LeaveRequest, TimeEntry

class HRMService:
    @staticmethod
    def request_leave(employee, data):
        """Applies organizational governance regarding concurrency rules and accruals prior to creating a LeaveRequest."""
        return LeaveRequest.objects.create(
            employee=employee,
            leave_type=data.get('leave_type'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            reason=data.get('reason', ''),
            status='pending'
        )

    @staticmethod
    def approve_leave(leave_obj, reviewer):
        """Executes a chain-of-command state update elevating an ongoing leave request."""
        leave_obj.status = 'approved'
        leave_obj.approved_by = reviewer
        leave_obj.action_date = timezone.now()
        leave_obj.save()
        
        # In a real workflow you would deduct days asynchronously or broadcast events
        return leave_obj
