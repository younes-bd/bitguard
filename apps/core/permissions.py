from rest_framework.permissions import BasePermission
from .services import has_permission

class HasRBACPermission(BasePermission):
    """
    Checks if user has the permission specified in `view.required_permission`.
    """
    def has_permission(self, request, view):
        required_perm = getattr(view, 'required_permission', None)
        
        # If view doesn't specify a permission, allow access (or use IsAuthenticated separately)
        if not required_perm:
            return True

        tenant = getattr(request, 'tenant', None)
        if not tenant:
            # Permissions restrict access only within a tenant context
            return False

        return has_permission(request.user, required_perm, tenant)
