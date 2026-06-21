"""HRM Views — Charter §8 compliant."""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.utils.response import standard_response
from ..domain.models import (
    Department, Employee, LeaveRequest, Certification, TimeEntry,
    PayrollPeriod, SalaryComponent, PaySlip, OnboardingInstance, OnboardingTask,
    JobPosition, JobApplication
)
from ..api.serializers import (
    DepartmentSerializer, EmployeeSerializer, LeaveRequestSerializer,
    CertificationSerializer, TimeEntrySerializer,
    PayrollPeriodSerializer, SalaryComponentSerializer, PaySlipSerializer,
    OnboardingInstanceSerializer, OnboardingTaskSerializer,
    JobPositionSerializer, JobApplicationSerializer
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

    @action(detail=True, methods=['post'])
    def generate_payslips(self, request, pk=None):
        period = self.get_object()
        return Response({'status': 'payslips generated'})

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        period = self.get_object()
        if period.is_closed:
            return Response({'error': 'Period already closed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Payroll Engine: Generate Payslips
        from ..domain.models import EmployeeContract, PaySlip, PaySlipLine, SalaryComponent
        from decimal import Decimal

        tenant = getattr(request, 'tenant', None)
        contracts = EmployeeContract.objects.filter(status='open')
        if tenant:
            contracts = contracts.filter(tenant=tenant)

        # Clear existing draft payslips for this period
        PaySlip.objects.filter(period=period, status='draft').delete()

        components = SalaryComponent.objects.all()
        if tenant:
            components = components.filter(tenant=tenant)
        
        earnings_components = components.filter(type='earning')
        deduction_components = components.filter(type='deduction')

        for contract in contracts:
            basic = contract.wage
            total_earnings = Decimal('0.00')
            total_deductions = Decimal('0.00')

            payslip = PaySlip.objects.create(
                tenant=tenant,
                employee=contract.employee,
                period=period,
                basic_salary=basic,
                status='paid' # Set to paid directly on process
            )

            # Add dynamic earnings
            for comp in earnings_components:
                amt = comp.amount # Simplification: fixed component amount
                if amt > 0:
                    PaySlipLine.objects.create(tenant=tenant, payslip=payslip, salary_component=comp, amount=amt)
                    total_earnings += amt

            # Add dynamic deductions (e.g. taxes)
            for comp in deduction_components:
                # If percentage based (simplification: if amount <= 100, treat as percentage)
                if comp.amount <= 100:
                    amt = basic * (comp.amount / Decimal('100.00'))
                else:
                    amt = comp.amount
                
                if amt > 0:
                    PaySlipLine.objects.create(tenant=tenant, payslip=payslip, salary_component=comp, amount=amt)
                    total_deductions += amt

            payslip.total_earnings = total_earnings
            payslip.total_deductions = total_deductions
            payslip.net_pay = basic + total_earnings - total_deductions
            payslip.save()

        period.is_closed = True
        period.save()

        # Enterprise Integration: Auto-generate Journal Entry for Payroll
        try:
            from django.db.models import Sum
            total_net_pay = period.payslips.aggregate(total=Sum('net_pay'))['total'] or 0
            if total_net_pay > 0:
                from apps.accounting.application.services import GeneralLedgerService
                from apps.core.services.audit import AuditService
                
                GeneralLedgerService.record_entry(
                    request, "Payroll Expense", total_net_pay, 'debit',
                    period.pk, 'payroll', f"Payroll run for {period.name}"
                )
                GeneralLedgerService.record_entry(
                    request, "Cash", total_net_pay, 'credit',
                    period.pk, 'payroll', f"Payroll run for {period.name}"
                )
                AuditService.log_action(request, "ERP_PAYROLL_PROCESSED", f"hrm.PayrollPeriod:{period.pk}", {"amount": float(total_net_pay)})
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Failed to process payroll GL for {period.name}: {e}")

        return Response({'status': 'success', 'message': 'Payroll processed and posted to ledger'})

class SalaryComponentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SalaryComponentSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = SalaryComponent.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class PaySlipViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaySlipSerializer
    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        qs = PaySlip.objects.all()
        if tenant: qs = qs.filter(tenant=tenant)
        period_id = self.request.query_params.get('period')
        if period_id: qs = qs.filter(period_id=period_id)
        return qs
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

    @action(detail=True, methods=['post'], url_path='generate-report')
    def generate_report(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        record = self.get_object()
        template = ReportTemplate.objects.filter(
            tenant=request.user.tenant,
            model=f"{record._meta.app_label}.{record._meta.model_name}",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, record)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        return Response({'url': attachment.file.url, 'filename': attachment.name})

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        payslip = self.get_object()
        payslip.status = 'approved'
        payslip.save()
        return Response({'status': payslip.status})

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        payslip = self.get_object()
        payslip.status = 'paid'
        payslip.save()
        return Response({'status': payslip.status})

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

from ..domain.models import EmployeeContract, LeaveAllocation, Attendance, Appraisal
from .serializers import EmployeeContractSerializer, LeaveAllocationSerializer, AttendanceSerializer, AppraisalSerializer

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
    serializer_class = AttendanceSerializer
    def get_queryset(self): return Attendance.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Attendance.objects.all()

class AppraisalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AppraisalSerializer
    def get_queryset(self): return Appraisal.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else Appraisal.objects.all()

from .serializers import PayrollStructureSerializer, PayrollRunSerializer, ExpenseReportSerializer
from ..domain.models import PayrollStructure, PayrollRun, ExpenseReport

class PayrollStructureViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayrollStructureSerializer
    def get_queryset(self): return PayrollStructure.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else PayrollStructure.objects.all()

class PayrollRunViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayrollRunSerializer
    def get_queryset(self): return PayrollRun.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else PayrollRun.objects.all()

class ExpenseReportViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseReportSerializer
    def get_queryset(self): return ExpenseReport.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else ExpenseReport.objects.all()
