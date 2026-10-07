from rest_framework import serializers
from ..domain.models import (
    Warehouse, InventoryItem, GoodsReceipt, GoodsReceiptLine, 
    InventoryMove, InventoryAdjustment, ReorderRule,
    InventoryLot, StorageLocation, InventoryPicking
)

class InventoryLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryLot
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class StorageLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageLocation
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class InventoryPickingSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryPicking
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class InventoryItemSerializer(serializers.ModelSerializer):
    quantity_available = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()

    name = serializers.CharField(source='product_name')
    unit_price = serializers.DecimalField(source='unit_cost', max_digits=12, decimal_places=2, required=False)

    class Meta:
        model = InventoryItem
        fields = [
            'id', 'product_id', 'name', 'sku', 'quantity_on_hand',
            'quantity_reserved', 'quantity_available', 'reorder_level',
            'unit_price', 'location', 'vendor', 'warehouse', 'is_low_stock', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

class GoodsReceiptLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoodsReceiptLine
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class GoodsReceiptSerializer(serializers.ModelSerializer):
    lines = GoodsReceiptLineSerializer(many=True, read_only=True)
    class Meta:
        model = GoodsReceipt
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class InventoryMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryMove
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class InventoryAdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryAdjustment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class ReorderRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReorderRule
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

