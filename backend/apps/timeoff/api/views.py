from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.timeoff.domain.models import LeaveRequest, LeaveAllocation
from apps.timeoff.api.serializers import LeaveRequestSerializer, LeaveAllocationSerializer

class LeaveRequestViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

class LeaveAllocationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = LeaveAllocation.objects.all()
    serializer_class = LeaveAllocationSerializer

