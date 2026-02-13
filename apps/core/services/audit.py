from ..models import AuditLog
from .base import BaseService

class AuditService(BaseService):
    """
    Service to handle systemic auditing and traceability.
    Charter Compliance: Every critical business event must be logged.
    """
    
    @staticmethod
    def log(request, action, resource, payload=None):
        """
        Logs an action to the AuditLog.
        Infers tenant and user from request context.
        """
        user = None
        if request and request.user.is_authenticated:
            user = request.user
            
        tenant = getattr(request, 'tenant', None)
        
        # Get IP address using utility method if available, or fallback
        # We can reuse DeviceService.get_client_ip if we import it, 
        # but to avoid circular deps with accounts, we'll do a simple check here.
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
            resource=resource,
            payload=payload or {},
            ip_address=ip
        )
