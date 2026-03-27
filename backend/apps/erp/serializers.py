"""
ERP Serializers — Explicit field declarations (no __all__).
"""
from rest_framework import serializers
from .models import Invoice, Payment, Expense, InternalProject


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'client', 'amount',
            'issue_date', 'due_date', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'invoice', 'amount', 'payment_date',
            'payment_method', 'reference', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            'id', 'title', 'amount', 'incurred_date',
            'category', 'receipt', 'user', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InternalProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalProject
        fields = [
            'id', 'name', 'description', 'client', 'deal_id',
            'status', 'budget', 'start_date', 'due_date',
            'assigned_to', 'is_service_obligation', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'is_service_obligation', 'created_at', 'updated_at']