from apps.audit.models import AuditLog
from .base import BaseService

class AuditService(BaseService):
    """
    Service to handle systemic auditing and traceability.
    Charter Compliance: Every critical business event must be logged.
    """
    
    @staticmethod
    def log_action(request, action, resource_type, resource_id, payload=None):
        """
        Logs an action to the AuditLog.
        Charter Compliance: Creates immutable entry with user, IP, and payload.
        """
        user = None
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user
            
        tenant = getattr(request, 'tenant', None)
        
        ip = None
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')

        return AuditLog.objects.create(
            user=user,
            tenant=tenant,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id),
            details=payload or {}, # Details maps to the payload
            ip_address=ip
        )
