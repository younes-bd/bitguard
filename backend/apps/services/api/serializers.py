from rest_framework import serializers
from ..domain.models import ServiceCategory, ServiceItem, ServiceRequest

# class ProblemSerializer(serializers.ModelSerializer):
#     assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    
#     class Meta:
#         model = Problem
#         fields = [
#             'id', 'title', 'description', 'status', 'priority',
#             'root_cause', 'permanent_fix', 'workaround',
#             'assigned_to', 'assigned_to_name', 'change_request',
#             'created_at', 'updated_at'
#         ]
#         read_only_fields = ('created_at', 'updated_at')

# class ChangeTaskSerializer(serializers.ModelSerializer):
#     assignee_name = serializers.CharField(source='assignee.get_full_name', read_only=True)
    
#     class Meta:
#         model = ChangeTask
#         fields = [
#             'id', 'change_request', 'title', 'assignee', 'assignee_name',
#             'status', 'created_at', 'updated_at'
#         ]
#         read_only_fields = ('created_at', 'updated_at')

# class ChangeRequestSerializer(serializers.ModelSerializer):
#     requester_name = serializers.CharField(source='requester.get_full_name', read_only=True)
#     approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
#     tasks = ChangeTaskSerializer(many=True, read_only=True)
#     problem_id = serializers.PrimaryKeyRelatedField(source='problem', read_only=True)
    
#     class Meta:
#         model = ChangeRequest
#         fields = [
#             'id', 'title', 'description', 'requester', 'requester_name',
#             'priority', 'status', 'risk_level', 'implementation_plan',
#             'rollback_plan', 'scheduled_date', 'approved_by', 'approved_by_name',
#             'tasks', 'problem_id', 'created_at', 'updated_at'
#         ]
#         read_only_fields = ('created_at', 'updated_at', 'approved_by')

class ServiceItemSerializer(serializers.ModelSerializer):
    sla_tier_name = serializers.CharField(source='sla_tier.name', read_only=True)
    service_owner_name = serializers.CharField(source='service_owner.get_full_name', read_only=True)

    class Meta:
        model = ServiceItem
        fields = [
            'id', 'name', 'description', 'icon', 'category', 'is_active',
            'sla_tier', 'sla_tier_name', 'approval_required', 'service_owner', 'service_owner_name'
        ]

class ServiceRequestSerializer(serializers.ModelSerializer):
    service_item_details = ServiceItemSerializer(source='service_item', read_only=True)
    requester_name = serializers.CharField(source='requester.get_full_name', read_only=True)
    ticket_id = serializers.PrimaryKeyRelatedField(source='ticket', read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'service_item', 'service_item_details', 'requester', 'requester_name',
            'status', 'form_data', 'ticket_id', 'created_at', 'closed_at'
        ]
        read_only_fields = ('created_at', 'closed_at')

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = [
            'id', 'name', 'slug', 'icon', 'color', 'description', 
            'sort_order', 'is_active', 'parent'
        ]
