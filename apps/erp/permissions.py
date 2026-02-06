from django.contrib.auth.mixins import AccessMixin
from django.shortcuts import redirect

class BaseRoleMixin(AccessMixin):
    """Base mixin for checking group membership."""
    allowed_groups = []

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return self.handle_no_permission()
        
        if request.user.is_superuser:
            return super().dispatch(request, *args, **kwargs)

        user_groups = request.user.groups.values_list('name', flat=True)
        if any(group in user_groups for group in self.allowed_groups):
            return super().dispatch(request, *args, **kwargs)
        
        return self.handle_no_permission()

class OperationsRequiredMixin(BaseRoleMixin):
    """Requires Operations, Executives, or Admin access."""
    allowed_groups = ['Operations', 'Executives']

class EngineeringRequiredMixin(BaseRoleMixin):
    """Requires Engineering, SOC, or CTO access."""
    allowed_groups = ['Engineering', 'SOC', 'Executives']

class SalesRequiredMixin(BaseRoleMixin):
    """Requires Sales access."""
    allowed_groups = ['Sales', 'Executives']

class StoreManagerRequiredMixin(BaseRoleMixin):
    """Requires Store Manager access."""
    allowed_groups = ['Store Managers', 'Operations', 'Executives']

class ExecutiveRequiredMixin(BaseRoleMixin):
    """Requires C-Level Access."""
    allowed_groups = ['Executives']

class ERPAccessMixin(AccessMixin):
    """
    General ERP Access.
    - Executives/Operations: Full Access
    - Engineering: Task/Project Access
    - Sales: Viewer Access
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return self.handle_no_permission()
        
        if request.user.is_superuser:
            return super().dispatch(request, *args, **kwargs)

        # Check for ANY valid ERP group
        valid_groups = ['Executives', 'Operations', 'Engineering', 'SOC', 'Sales', 'Store Managers']
        if request.user.groups.filter(name__in=valid_groups).exists():
            return super().dispatch(request, *args, **kwargs)
            
        return self.handle_no_permission()
