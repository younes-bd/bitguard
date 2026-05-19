from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.core.permissions import HasRole, IsSuperAdmin
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Audit logs are read-only and restricted to admins.
    """
    permission_classes = [IsAuthenticated, IsSuperAdmin | HasRole(['SUPER_ADMIN', 'TENANT_ADMIN', 'SOC_ADMIN'])]
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer