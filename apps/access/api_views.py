from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Permission, Role
from .serializers import PermissionSerializer, RoleSerializer

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List available permissions (e.g., for assigning to roles).
    """
    queryset = Permission.objects.all().order_by('product', 'code')
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]

class RoleViewSet(viewsets.ModelViewSet):
    """
    Manage Roles (Create, Update, Delete, Assign Permissions).
    Scoped to the current Tenant.
    """
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admin gets all roles for their tenant
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            return Role.objects.none()
        return Role.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        serializer.save(tenant=tenant)
