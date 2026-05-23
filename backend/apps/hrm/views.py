"""HRM Views — Charter §8 compliant."""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from .models import (
    Department, Employee, LeaveRequest, Certification, TimeEntry,
    PayrollPeriod, PayrollRecord, OnboardingInstance, OnboardingTask
)
from .serializers import (
    DepartmentSerializer, EmployeeSerializer, LeaveRequestSerializer,
    CertificationSerializer, TimeEntrySerializer,
    PayrollPeriodSerializer, PayrollRecordSerializer,
    OnboardingInstanceSerializer, OnboardingTaskSerializer
)

class DepartmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()

class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.select_related('user', 'department').all()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Aggregated HRM KPIs for the dashboard."""
        from django.db.models import Sum
        employees = Employee.objects.all()
        tenant = getattr(request, 'tenant', None)
        if tenant:
            employees = employees.filter(tenant=tenant)
        headcount = employees.filter(status='active').count()
        total_salary = employees.filter(status='active').aggregate(total=Sum('salary'))['total'] or 0
        return Response({'status': 'success', 'data': {
            'headcount': headcount,
            'pending_leaves': LeaveRequest.objects.filter(status='pending').count(),
            'departments': Department.objects.count(),
            'active_certs': Certification.objects.filter(is_active=True).count(),
            'total_salary': float(total_salary),
        }})

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

class HrmDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Sum
        employees = Employee.objects.all()
        tenant = getattr(request, 'tenant', None)
        if tenant:
            employees = employees.filter(tenant=tenant)
        
        headcount = employees.filter(status='active').count()
        total_salary = employees.filter(status='active').aggregate(total=Sum('salary'))['total'] or 0
        pending_leaves = LeaveRequest.objects.filter(status='pending').count()
        departments = Department.objects.count()
        active_certs = Certification.objects.filter(is_active=True).count()
        
        return standard_response(True, "HRM Dashboard Data", {
            'headcount': headcount,
            'pending_leaves': pending_leaves,
            'departments': departments,
            'active_certs': active_certs,
            'total_salary': float(total_salary),
            'headcount_trend': [], # Optional: Add historical data here if requested
        })

class PayrollPeriodViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayrollPeriodSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = PayrollPeriod.objects.all().order_by('-start_date')
        if tenant: qs = qs.filter(tenant=tenant)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class PayrollRecordViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayrollRecordSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = PayrollRecord.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        period_id = self.request.query_params.get('period')
        if period_id: qs = qs.filter(period_id=period_id)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class OnboardingInstanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OnboardingInstanceSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = OnboardingInstance.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class OnboardingTaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OnboardingTaskSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = OnboardingTask.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))
