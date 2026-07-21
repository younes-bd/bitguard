from rest_framework import serializers
from apps.mrp.domain.models import (
    WorkCenter, Routing, RoutingOperation, BillOfMaterial, BillOfMaterialLine,
    ManufacturingOrder, WorkOrder, ScrapOrder
)

class WorkCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkCenter
        fields = '__all__'

class RoutingOperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutingOperation
        fields = '__all__'

class RoutingSerializer(serializers.ModelSerializer):
    operations = RoutingOperationSerializer(many=True, read_only=True)
    class Meta:
        model = Routing
        fields = '__all__'

class BillOfMaterialLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillOfMaterialLine
        fields = '__all__'

class BillOfMaterialSerializer(serializers.ModelSerializer):
    lines = BillOfMaterialLineSerializer(many=True, read_only=True)
    class Meta:
        model = BillOfMaterial
        fields = '__all__'

class WorkOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrder
        fields = '__all__'

class ManufacturingOrderSerializer(serializers.ModelSerializer):
    work_orders = WorkOrderSerializer(many=True, read_only=True)
    class Meta:
        model = ManufacturingOrder
        fields = '__all__'

class ScrapOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapOrder
        fields = '__all__'
