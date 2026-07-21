"""HRM Views — Charter §8 compliant."""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from ..domain.models import (
    Department, Employee, Certification, TimeEntry,
    OnboardingInstance, OnboardingTask, EmployeeSkill
)
from apps.hr_holidays.models import LeaveRequest
from apps.hr_payroll.models import PayrollPeriod
from apps.hr_recruitment.models import JobPosition, JobApplication
from apps.hr_appraisal.models import PerformanceReview
from ..api.serializers import (
    DepartmentSerializer, EmployeeSerializer, LeaveRequestSerializer,
    CertificationSerializer, TimeEntrySerializer,
    PayrollPeriodSerializer,
    OnboardingInstanceSerializer, OnboardingTaskSerializer,
    JobPositionSerializer, JobApplicationSerializer,
    PerformanceReviewSerializer, EmployeeSkillSerializer
)

class DepartmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DepartmentSerializer
    def get_queryset(self):
        return Department.objects.filter(tenant=self.request.user.tenant)

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PerformanceReviewSerializer
    def get_queryset(self):
        return PerformanceReview.objects.filter(tenant=self.request.user.tenant)

class EmployeeSkillViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeSkillSerializer
    def get_queryset(self):
        return EmployeeSkill.objects.filter(tenant=self.request.user.tenant)


class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.select_related('user', 'department').all()
    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff and not request.user.is_superuser:
            if not request.user.roles.filter(name__in=['SUPER_ADMIN', 'TENANT_ADMIN']).exists():
                return Response({'error': 'Forbidden: Requires admin role'}, status=403)
        return super().destroy(request, *args, **kwargs)

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

from apps.hr_payroll.models import PayslipBatch, Payslip, PayslipLine, SalaryRule
from .serializers import PayslipBatchSerializer, PayslipSerializer, PayslipLineSerializer, SalaryRuleSerializer

class PayslipBatchViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayslipBatchSerializer
    
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = PayslipBatch.objects.all().order_by('-date_start')
        if tenant: qs = qs.filter(tenant=tenant)
        return qs
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

    @action(detail=True, methods=['post'])
    def generate_payslips(self, request, pk=None):
        if not request.user.is_staff and not request.user.is_superuser:
            if not request.user.roles.filter(name__in=['SUPER_ADMIN', 'TENANT_ADMIN', 'MANAGER']).exists():
                return Response({'error': 'Forbidden: Requires admin or manager role'}, status=status.HTTP_403_FORBIDDEN)
                
        batch = self.get_object()
        if batch.state == 'close':
            return Response({'error': 'Batch already closed'}, status=status.HTTP_400_BAD_REQUEST)
            
        from ..domain.models import EmployeeContract
        from decimal import Decimal
        tenant = getattr(request, 'tenant', None)
        
        contracts = EmployeeContract.objects.filter(status='open')
        if tenant:
            contracts = contracts.filter(tenant=tenant)
            
        Payslip.objects.filter(batch=batch, state='draft').delete()
        
        for contract in contracts:
            if not contract.payroll_structure:
                continue
                
            payslip = Payslip.objects.create(
                tenant=tenant,
                employee=contract.employee,
                batch=batch,
                structure=contract.payroll_structure,
                date_from=batch.date_start,
                date_to=batch.date_end,
                basic_salary=contract.wage,
                state='draft'
            )
            
            rules = contract.payroll_structure.rules.all().order_by('sequence')
            gross = contract.wage
            deductions = Decimal('0.00')
            
            for rule in rules:
                amt = Decimal('0.00')
                if rule.amount_type == 'fixed':
                    amt = rule.amount
                elif rule.amount_type == 'percent':
                    amt = contract.wage * (rule.amount / Decimal('100.00'))
                    
                if rule.category == 'deduction':
                    deductions += amt
                elif rule.category == 'allowance':
                    gross += amt
                    
                if amt > 0:
                    PayslipLine.objects.create(tenant=tenant, payslip=payslip, rule=rule, amount=amt)
                    
            payslip.gross_salary = gross
            payslip.total_deductions = deductions
            payslip.net_salary = gross - deductions
            payslip.save()
            
        batch.state = 'verify'
        batch.save()
        
        return Response({'status': 'success', 'message': 'Payslips generated for batch.'})

class PayslipViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayslipSerializer
    
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = Payslip.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        batch_id = self.request.query_params.get('batch')
        if batch_id: qs = qs.filter(batch_id=batch_id)
        return qs
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class SalaryRuleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SalaryRuleSerializer
    
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = SalaryRule.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
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

class JobPositionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = JobPositionSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = JobPosition.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class JobApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = JobApplication.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

from ..domain.models import EmployeeContract
from apps.hr_holidays.models import LeaveAllocation
from apps.hr_attendance.models import Attendance
from apps.hr_appraisal.models import Appraisal
from .serializers import EmployeeContractSerializer, LeaveAllocationSerializer, HrAttendanceerializer, AppraisalSerializer

class EmployeeContractViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeContractSerializer
    def get_queryset(self): return EmployeeContract.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else EmployeeContract.objects.all()

class LeaveAllocationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LeaveAllocationSerializer
    def get_queryset(self): return LeaveAllocation.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else LeaveAllocation.objects.all()

class AttendanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HrAttendanceerializer
    def get_queryset(self): return Attendance.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Attendance.objects.all()

class AppraisalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AppraisalSerializer
    def get_queryset(self): return Appraisal.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Appraisal.objects.all()

from .serializers import PayrollStructureSerializer, ExpenseReportSerializer
from apps.hr_payroll.models import PayrollStructure
from apps.hr_expense.models import ExpenseReport

class PayrollStructureViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayrollStructureSerializer
    def get_queryset(self): return PayrollStructure.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else PayrollStructure.objects.all()


class ExpenseReportViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseReportSerializer
    def get_queryset(self): return ExpenseReport.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else ExpenseReport.objects.all()

from apps.hr_recruitment.models import JobApplicant
from apps.hr_appraisal.models import PerformanceAppraisal
from ..domain.models import ReferralCampaign
from .serializers import JobApplicantSerializer, PerformanceAppraisalSerializer, ReferralCampaignSerializer

class JobApplicantViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicantSerializer
    def get_queryset(self): return JobApplicant.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else JobApplicant.objects.all()

class PerformanceAppraisalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PerformanceAppraisalSerializer
    def get_queryset(self): return PerformanceAppraisal.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else PerformanceAppraisal.objects.all()

class ReferralCampaignViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReferralCampaignSerializer
    def get_queryset(self): return ReferralCampaign.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else ReferralCampaign.objects.all()
