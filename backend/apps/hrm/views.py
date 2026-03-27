"""HRM Views — Charter §8 compliant."""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Department, Employee, LeaveRequest, Certification, TimeEntry
from .serializers import (
    DepartmentSerializer, EmployeeSerializer, LeaveRequestSerializer,
    CertificationSerializer, TimeEntrySerializer,
)

class DepartmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()

class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.select_related('user', 'department').all()

class LeaveRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LeaveRequestSerializer

    def get_queryset(self):
        qs = LeaveRequest.objects.all()
        if not self.request.user.is_staff:
            # Non-staff only see their own requests
            qs = qs.filter(employee__user=self.request.user)
        return qs

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'approved'
        leave.approved_by = request.user
        leave.save(update_fields=['status', 'approved_by'])
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'rejected'
        leave.approved_by = request.user
        leave.save(update_fields=['status', 'approved_by'])
        return Response({'status': 'rejected'})

class CertificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CertificationSerializer
    queryset = Certification.objects.all()

class TimeEntryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TimeEntrySerializer

    def get_queryset(self):
        qs = TimeEntry.objects.all()
        if not self.request.user.is_staff:
            qs = qs.filter(employee__user=self.request.user)
        return qs
