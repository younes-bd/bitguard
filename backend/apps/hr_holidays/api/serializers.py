from rest_framework import serializers
from apps.hr_holidays.domain.models import LeaveRequest, LeaveAllocation

class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class LeaveAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveAllocation
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

