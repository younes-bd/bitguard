from rest_framework import serializers
from ..domain.models import Department, Employee, LeaveRequest, Certification, TimeEntry, PayrollPeriod, SalaryComponent, PaySlip, OnboardingInstance, OnboardingTask


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'manager', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'full_name', 'department', 'department_name',
            'employee_id', 'job_title', 'status', 'hire_date',
            'skills', 'phone', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.user.get_full_name')

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_name', 'leave_type', 'start_date',
            'end_date', 'status', 'reason', 'approved_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'approved_by', 'created_at', 'updated_at']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            'id', 'employee', 'title', 'issuer', 'issued_date',
            'expiry_date', 'credential_id', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TimeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = [
            'id', 'employee', 'project_id', 'project_name',
            'description', 'hours', 'entry_date', 'is_billable', 'approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PayrollPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollPeriod
        fields = ['id', 'name', 'start_date', 'end_date', 'is_closed', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class SalaryComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryComponent
        fields = ['id', 'name', 'type', 'amount', 'is_taxable', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class PaySlipSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.user.get_full_name')
    period_name = serializers.ReadOnlyField(source='period.name')
    
    class Meta:
        model = PaySlip
        fields = [
            'id', 'employee', 'employee_name', 'period', 'period_name',
            'basic_salary', 'total_earnings', 'total_deductions', 'net_pay', 'status', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class OnboardingTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingTask
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class OnboardingInstanceSerializer(serializers.ModelSerializer):
    tasks = OnboardingTaskSerializer(many=True, read_only=True)
    progress_percent = serializers.ReadOnlyField()

    class Meta:
        model = OnboardingInstance
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

from ..domain.models import JobPosition, JobApplication

class JobPositionSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    class Meta:
        model = JobPosition
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class JobApplicationSerializer(serializers.ModelSerializer):
    job_position_name = serializers.ReadOnlyField(source='job_position.name')
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

from ..domain.models import EmployeeContract, LeaveAllocation, Attendance, Appraisal

class EmployeeContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeContract
        fields = '__all__'

class LeaveAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveAllocation
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class AppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appraisal
        fields = '__all__'

from ..domain.models import PayrollStructure, PayrollRun, ExpenseReport

class PayrollStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollStructure
        fields = '__all__'

class PayrollRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollRun
        fields = '__all__'

class ExpenseReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseReport
        fields = '__all__'
