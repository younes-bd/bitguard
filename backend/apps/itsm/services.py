from .models import ChangeRequest

class ITSMService:
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
