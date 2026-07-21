from rest_framework import serializers
from ..domain.models import Department, Employee, Certification, TimeEntry, OnboardingInstance, OnboardingTask, EmployeeSkill
from apps.hr_holidays.models import LeaveRequest
from apps.hr_payroll.models import PayrollPeriod
from apps.hr_appraisal.models import PerformanceReview

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'manager', 'parent', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class PerformanceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = '__all__'

class EmployeeSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeSkill
        fields = '__all__'


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

from apps.hr_payroll.models import PayslipBatch, Payslip, PayslipLine, SalaryRule

class PayslipBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayslipBatch
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PayslipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payslip
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PayslipLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayslipLine
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class SalaryRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryRule
        fields = '__all__'
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

from apps.hr_recruitment.models import JobPosition, JobApplication

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

from ..domain.models import EmployeeContract
from apps.hr_holidays.models import LeaveAllocation
from apps.hr_attendance.models import Attendance
from apps.hr_appraisal.models import Appraisal

class EmployeeContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeContract
        fields = '__all__'

class LeaveAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveAllocation
        fields = '__all__'

class HrAttendanceerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class AppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appraisal
        fields = '__all__'

from apps.hr_payroll.models import PayrollStructure
from apps.hr_expense.models import ExpenseReport

class PayrollStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollStructure
        fields = '__all__'



class ExpenseReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseReport
        fields = '__all__'

from apps.hr_recruitment.models import JobApplicant
from apps.hr_appraisal.models import PerformanceAppraisal
from ..domain.models import ReferralCampaign

class JobApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplicant
        fields = '__all__'

class PerformanceAppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceAppraisal
        fields = '__all__'

class ReferralCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralCampaign
        fields = '__all__'


