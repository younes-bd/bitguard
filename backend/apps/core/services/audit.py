from apps.audit.models import AuditLog
from .base import BaseService

class AuditService(BaseService):
    """
    Service to handle systemic auditing and traceability.
    Charter Compliance: Every critical business event must be logged.
    """
    
    @staticmethod
    def log_action(request, action, *args, **kwargs):
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

        # Unpack highly flexible parameters to support all callers in the monorepo
        resource_type = kwargs.get('resource_type')
        resource_id = kwargs.get('resource_id')
        payload = kwargs.get('payload')
        resource = kwargs.get('resource')

        if args:
            pos_resource = args[0]
            if isinstance(pos_resource, str):
                resource = pos_resource
            else:
                payload = pos_resource
            
            if len(args) > 1:
                payload = args[1]

        if resource:
            if ':' in resource:
                parts = resource.split(':', 1)
                resource_type = parts[0]
                resource_id = parts[1]
            else:
                resource_type = resource
                resource_id = "0"

        if not resource_id:
            resource_id = "0"
        if not resource_type:
            resource_type = "System"

        return AuditLog.objects.create(
            user=user,
            tenant=tenant,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id),
            details=payload or {},
            ip_address=ip
        )
