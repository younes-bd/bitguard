from rest_framework import serializers
from .models import Vendor, InventoryItem, PurchaseOrder, PurchaseOrderLine


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            'id', 'name', 'contact_name', 'email', 'phone', 'website',
            'status', 'lead_time_days', 'payment_terms', 'country', 'notes', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class InventoryItemSerializer(serializers.ModelSerializer):
    quantity_available = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = InventoryItem
        fields = [
            'id', 'product_id', 'product_name', 'sku', 'quantity_on_hand',
            'quantity_reserved', 'quantity_available', 'reorder_level',
            'unit_cost', 'location', 'vendor', 'is_low_stock', 'created_at',
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
            'received_date', 'total_cost', 'notes', 'created_by', 'lines', 'created_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at']
