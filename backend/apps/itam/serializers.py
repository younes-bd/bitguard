from rest_framework import serializers
from .models import Asset, AssetAssignment, MaintenanceRecord


class AssetListSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True, default=None)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, default=None)
    is_warranty_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'asset_tag', 'asset_type', 'make', 'model',
            'serial_number', 'status', 'client_name', 'assigned_to_name',
            'purchase_date', 'warranty_expires', 'is_warranty_active',
            'location', 'created_at',
        ]


class AssetDetailSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True, default=None)
    is_warranty_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'


class AssetAssignmentSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    user_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, default=None)

    class Meta:
        model = AssetAssignment
        fields = ['id', 'asset', 'asset_name', 'assigned_to', 'user_name', 'assigned_at', 'returned_at', 'notes']


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)

    class Meta:
        model = MaintenanceRecord
        fields = ['id', 'asset', 'asset_name', 'maintenance_type', 'performed_by', 'performed_at', 'cost', 'notes']
