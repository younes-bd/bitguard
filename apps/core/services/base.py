from django.db import models
from django.core.exceptions import PermissionDenied

class BaseService:
    """
    Base class for all business services.
    Enforces tenant context and provides common utilities for Charter compliance.
    """
    
    @staticmethod
    def get_tenant_context(request):
        """
        Retrieves the tenant from the request, ensuring it exists for restricted actions.
        """
        tenant = getattr(request, 'tenant', None)
        return tenant

    @classmethod
    def filter_by_context(cls, queryset, request):
        """
        Filters a queryset based on the current tenant context.
        If no tenant is present, returns an empty queryset unless the user is staff.
        """
        tenant = cls.get_tenant_context(request)
        
        if request.user.is_staff:
            return queryset
            
        if not tenant:
            return queryset.none()
            
        # Dynamically filter by tenant if the model has a tenant field
        if hasattr(queryset.model, 'tenant'):
            return queryset.filter(tenant=tenant)
            
        return queryset

    @classmethod
    def validate_ownership(cls, instance, request):
        """
        Validates that the current user/tenant owns the instance.
        """
        tenant = cls.get_tenant_context(request)
        
        if request.user.is_staff:
            return True
            
        if hasattr(instance, 'tenant') and instance.tenant != tenant:
            raise PermissionDenied("You do not have access to this resource in the current context.")
            
        return True

    @classmethod
    def get_stale_threshold(cls):
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() - timedelta(days=2)

    @classmethod
    def get_today(cls):
        from django.utils import timezone
        return timezone.now().date()
