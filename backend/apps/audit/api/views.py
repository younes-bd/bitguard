# DEPRECATED - NOT MOUNTED - Use base_setup instead.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.core.permissions import HasRole, IsSuperAdmin
from ..domain.models import AuditLog
from ..api.serializers import AuditLogSerializer

class AuditViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Audit logs are read-only and restricted to admins.
    """
    permission_classes = [IsAuthenticated, IsSuperAdmin | HasRole(['SUPER_ADMIN', 'TENANT_ADMIN', 'SOC_ADMIN'])]
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer