from .models import ChangeRequest

class ITSMService:
    @staticmethod
    def approve_change(change_request, user):
        """
        Elevate a CR via executive approval.
        """
        change_request.status = 'approved'
        change_request.approved_by = user
        change_request.save()
        return change_request

    @staticmethod
    def progress_change(change_request):
        """
        Mark CR as engaged in active deployment architecture.
        """
        change_request.status = 'in_progress'
        change_request.save()
        return change_request
