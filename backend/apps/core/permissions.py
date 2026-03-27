from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

class HasRole(BasePermission):
    """
    Allows access only to users with the specified role(s).
    Usage in views: permission_classes = [HasRole(['SOC_ADMIN', 'TENANT_ADMIN'])]
    """
    def __init__(self, allowed_roles):
        self.allowed_roles = allowed_roles

    def __call__(self):
        return self

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.is_superuser:
            return True

        # Assumes user.roles.all() exists (implemented in apps.users later)
        try:
            user_roles = [r.name for r in request.user.roles.all()]
            return any(role in self.allowed_roles for role in user_roles)
        except AttributeError:
            return False

class IsTenantUser(BasePermission):
    """
    Allows access only if the requested tenant matches the user's tenant.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
            
        request_tenant = getattr(request, 'tenant', None)
        user_tenant = getattr(request.user, 'tenant', None)
        
        if request_tenant and user_tenant:
            return request_tenant == user_tenant
        return False
