from rest_framework import serializers
from ..domain.models import Vendor, PurchaseOrder, PurchaseOrderLine, RFQ, VendorPricelist

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            'id', 'name', 'contact_name', 'email', 'phone', 'website',
            'status', 'payment_terms', 'country', 'notes', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PurchaseOrderLineSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = PurchaseOrderLine
        fields = ['id', 'inventory_item', 'quantity_ordered', 'unit_cost', 'quantity_received', 'line_total']
        read_only_fields = ['id']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    lines = PurchaseOrderLineSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'vendor', 'status', 'order_date', 'expected_date',
            'received_date', 'total_amount', 'notes', 'created_by', 'lines', 'created_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at']

class RFQSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFQ
        fields = '__all__'

class VendorPricelistSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPricelist
        fields = '__all__'
