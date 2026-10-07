from rest_framework import serializers
from apps.sales.domain.models import SalesOrder, SalesOrderLine

class RentalOrderLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrderLine
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class RentalOrderSerializer(serializers.ModelSerializer):
    lines = RentalOrderLineSerializer(many=True, read_only=True)

    class Meta:
        model = SalesOrder
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
