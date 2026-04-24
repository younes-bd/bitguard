from rest_framework import serializers
from .models import ApprovalRequest, ApprovalStep

class ApprovalStepSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source='approver.get_full_name', read_only=True)
    
    class Meta:
        model = ApprovalStep
        fields = [
            'id', 'approval_request', 'step_order', 'approver', 
            'approver_name', 'status', 'decided_at', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ('decided_at', 'created_at', 'updated_at')

class ApprovalRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.get_full_name', read_only=True)
    decided_by_name = serializers.CharField(source='decided_by.get_full_name', read_only=True)
    steps = ApprovalStepSerializer(many=True, read_only=True)
    
    class Meta:
        model = ApprovalRequest
        fields = [
            'id', 'title', 'request_type', 'requester', 'requester_name',
            'status', 'payload', 'decided_by', 'decided_by_name',
            'decided_at', 'comments', 'steps', 'created_at', 'updated_at'
        ]
        read_only_fields = ('status', 'decided_by', 'decided_at', 'created_at', 'updated_at')
