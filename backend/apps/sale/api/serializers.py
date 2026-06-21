from rest_framework import serializers
from ..domain.models import SaleOrder, SaleOrderLine

class SaleOrderLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleOrderLine
        fields = '__all__'
        read_only_fields = ('tenant',)

class SaleOrderSerializer(serializers.ModelSerializer):
    lines = SaleOrderLineSerializer(many=True, read_only=True)

    class Meta:
        model = SaleOrder
        fields = '__all__'
        read_only_fields = ('tenant', 'total_amount', 'subtotal', 'tax_total')
