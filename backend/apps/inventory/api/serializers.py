from rest_framework import serializers
from ..domain.models import Warehouse, InventoryItem, GoodsReceipt, GoodsReceiptLine, StockMove, StockAdjustment, ReorderRule, DeliveryNote

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

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

class GoodsReceiptSerializer(serializers.ModelSerializer):
    lines = GoodsReceiptLineSerializer(many=True, read_only=True)
    class Meta:
        model = GoodsReceipt
        fields = '__all__'

class StockMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMove
        fields = '__all__'

class StockAdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockAdjustment
        fields = '__all__'

class ReorderRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReorderRule
        fields = '__all__'

class DeliveryNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryNote
        fields = '__all__'
