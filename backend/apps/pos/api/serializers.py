from rest_framework import serializers
from apps.pos.domain.models import PosConfig, PosSession, PosOrder, PosPayment, RestaurantFloor, RestaurantTable, RestaurantPrinter

class PosConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosConfig
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class PosSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosSession
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class PosOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosOrder
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class PosPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosPayment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class RestaurantFloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantFloor
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class RestaurantTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantTable
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class RestaurantPrinterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantPrinter
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

