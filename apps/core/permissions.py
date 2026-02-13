from rest_framework import permissions
from apps.core.services.control import ControlService

class ConstitutionPermission(permissions.BasePermission):
    """
    Centralized Access Control (Section 21).
    Delegates all permission checks to the Unified Control Plane.
    """

    def has_permission(self, request, view):
        # Determine the action type
        action_map = {
            'GET': 'VIEW',
            'POST': 'CREATE',
            'PUT': 'UPDATE',
            'PATCH': 'UPDATE',
            'DELETE': 'DELETE'
        }
        action = action_map.get(request.method, 'UNKNOWN')
        
        # Determine the resource
        # For simplicity, we use the view's model or name
        resource = getattr(view, 'queryset', None)
        if resource is not None:
            resource_name = resource.model._meta.label
        else:
            resource_name = view.__class__.__name__

        return ControlService.enforce_policy(request.user, action, resource_name)

    def has_object_permission(self, request, view, obj):
        # We delegate per-object checks to the ControlService as well if needed.
        # For now, we assume if you have permission for the resource, 
        # the queryset filtering handles row-level isolation.
        return self.has_permission(request, view)
