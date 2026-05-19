from rest_framework import serializers
from .models import ChangeRequest, ChangeTask, Problem

class ProblemSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    
    class Meta:
        model = Problem
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'root_cause', 'permanent_fix', 'workaround',
            'assigned_to', 'assigned_to_name', 'change_request',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

class ChangeTaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assignee.get_full_name', read_only=True)
    
    class Meta:
        model = ChangeTask
        fields = [
            'id', 'change_request', 'title', 'assignee', 'assignee_name',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

class ChangeRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    tasks = ChangeTaskSerializer(many=True, read_only=True)
    problem_id = serializers.PrimaryKeyRelatedField(source='problem', read_only=True)
    
    class Meta:
        model = ChangeRequest
        fields = [
            'id', 'title', 'description', 'requester', 'requester_name',
            'priority', 'status', 'risk_level', 'implementation_plan',
            'rollback_plan', 'scheduled_date', 'approved_by', 'approved_by_name',
            'tasks', 'problem_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at', 'approved_by')

