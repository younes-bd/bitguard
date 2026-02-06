from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Tenant
from .serializers import TenantSerializer

class TenantViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet to resolve tenant by slug or current context.
    """
    queryset = Tenant.objects.filter(is_active=True)
    serializer_class = TenantSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Returns the tenant from the current request context (via Middleware).
        """
        if getattr(request, 'tenant', None):
            serializer = self.get_serializer(request.tenant)
            return Response(serializer.data)
        # Return empty object instead of 404 to prevent frontend noise
        return Response({})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def permissions(self, request):
        """
        Returns the list of permission codes for the current user in the active tenant.
        DEPRECATED: Permissions are now handled via Access App, but kept for compatibility during migration.
        """
        tenant = getattr(request, 'tenant', None)
        if not tenant:
            return Response([])

        # Cross-app import (UserRole is now in access)
        from apps.access.models import UserRole
        perms = UserRole.objects.filter(
            user=request.user, 
            role__tenant=tenant
        ).values_list('role__permissions__code', flat=True).distinct()
        
        return Response(list(perms))
