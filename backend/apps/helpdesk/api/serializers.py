from rest_framework import serializers
from ..domain.models import (
    Ticket, TicketMessage, KnowledgeArticle,
    HelpdeskTeam, HelpdeskStage, HelpdeskTag, SlaPolicy
)

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.ReadOnlyField(source='sender.email')
    sender_name = serializers.SerializerMethodField()
    sender_is_staff = serializers.ReadOnlyField(source='sender.is_staff')

    class Meta:
        model = TicketMessage
        fields = ['id', 'ticket', 'sender', 'sender_email', 'sender_name', 'sender_is_staff', 'body', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

    def get_sender_name(self, obj):
        if not obj.sender:
            return "System"
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip() or obj.sender.username

class TicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    customer_email = serializers.ReadOnlyField(source='customer.email')
    assigned_to_email = serializers.ReadOnlyField(source='assigned_to.email')

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'ticket_number', 'description', 'status', 'ticket_type', 'priority', 'risk_level', 'tenant',
            'customer', 'customer_email', 'assigned_to', 'assigned_to_email', 
            'team', 'stage', 'tags', 'sla_policy', 'sla_deadline', 'sla_breached',
            'first_response_at', 'resolved_at', 'parent_ticket',
            'created_at', 'updated_at', 'messages', 'due_date', 'related_articles', 'is_converted_to_kb'
        ]
        read_only_fields = ['id', 'tenant', 'created_at', 'updated_at', 'customer', 'related_articles', 'is_converted_to_kb', 'ticket_number']

class KnowledgeArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeArticle
        fields = ['id', 'title', 'slug', 'author', 'status', 'category', 'content', 'views', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class HelpdeskTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpdeskTeam
        fields = ['id', 'name', 'leader', 'members', 'alias_email', 'use_sla']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class HelpdeskStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpdeskStage
        fields = ['id', 'name', 'sequence', 'team', 'is_closed', 'fold', 'color']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class HelpdeskTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpdeskTag
        fields = ['id', 'name', 'color']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class SlaPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = SlaPolicy
        fields = ['id', 'name', 'team', 'priority', 'ticket_type', 'target_type', 'target_hours']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
