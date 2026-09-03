from rest_framework import serializers
from apps.mrp_plm.domain.models import EngineeringChangeOrder, ECOType

class EngineeringChangeOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngineeringChangeOrder
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class ECOTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ECOType
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

