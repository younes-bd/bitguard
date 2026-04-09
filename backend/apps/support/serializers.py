from rest_framework import serializers
from .models import Ticket, TicketMessage, KnowledgeArticle

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.ReadOnlyField(source='sender.email')

    class Meta:
        model = TicketMessage
        fields = ['id', 'ticket', 'sender', 'sender_email', 'body', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    customer_email = serializers.ReadOnlyField(source='customer.email')
    assigned_to_email = serializers.ReadOnlyField(source='assigned_to.email')

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'tenant',
            'customer', 'customer_email', 'assigned_to', 'assigned_to_email', 
            'created_at', 'updated_at', 'messages', 'due_date', 'related_articles', 'is_converted_to_kb'
        ]
        read_only_fields = ['id', 'tenant', 'created_at', 'updated_at', 'customer', 'related_articles', 'is_converted_to_kb']

class KnowledgeArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeArticle
        fields = ['id', 'title', 'category', 'content', 'views', 'created_at', 'updated_at']
