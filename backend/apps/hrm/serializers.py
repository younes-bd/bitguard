from rest_framework import serializers
from .models import Department, Employee, LeaveRequest, Certification, TimeEntry


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'manager', 'created_at']
        read_only_fields = ['id', 'created_at']


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'full_name', 'department', 'department_name',
            'employee_id', 'job_title', 'status', 'hire_date',
            'skills', 'phone', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.user.get_full_name')

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_name', 'leave_type', 'start_date',
            'end_date', 'status', 'reason', 'approved_by', 'created_at',
        ]
        read_only_fields = ['id', 'approved_by', 'created_at']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            'id', 'employee', 'title', 'issuer', 'issued_date',
            'expiry_date', 'credential_id', 'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class TimeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = [
            'id', 'employee', 'project_id', 'project_name',
            'description', 'hours', 'entry_date', 'is_billable', 'approved', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
