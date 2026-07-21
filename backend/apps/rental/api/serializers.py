from rest_framework import serializers
from apps.sale.domain.models import SaleOrder, SaleOrderLine

class RentalOrderLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleOrderLine
        fields = '__all__'

class RentalOrderSerializer(serializers.ModelSerializer):
    lines = RentalOrderLineSerializer(many=True, read_only=True)

    class Meta:
        model = SaleOrder
        fields = '__all__'
