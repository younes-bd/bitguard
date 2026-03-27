from rest_framework import serializers
from .models import SLATier, ServiceContract, SLABreach, Quote, QuoteLine


class SLATierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLATier
        fields = [
            'id', 'name', 'description', 'first_response_hours',
            'resolution_hours', 'uptime_percent', 'coverage', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class ServiceContractSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')
    sla_tier_name = serializers.ReadOnlyField(source='sla_tier.name')
    is_active = serializers.ReadOnlyField()
    annual_value = serializers.ReadOnlyField()

    class Meta:
        model = ServiceContract
        fields = [
            'id', 'client', 'client_name', 'contract_type', 'sla_tier',
            'sla_tier_name', 'status', 'start_date', 'end_date',
            'monthly_value', 'annual_value', 'auto_renew', 'assigned_to',
            'notes', 'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class SLABreachSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLABreach
        fields = [
            'id', 'contract', 'ticket_id', 'breach_type',
            'breached_at', 'acknowledged', 'resolution_note', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class QuoteLineSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = QuoteLine
        fields = ['id', 'description', 'quantity', 'unit_price', 'line_total']
        read_only_fields = ['id']


class QuoteSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')
    lines = QuoteLineSerializer(many=True, read_only=True)
    subtotal = serializers.ReadOnlyField()
    total = serializers.ReadOnlyField()

    class Meta:
        model = Quote
        fields = [
            'id', 'deal', 'client', 'client_name', 'status',
            'valid_until', 'discount_percent', 'notes',
            'created_by', 'lines', 'subtotal', 'total', 'created_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at']
