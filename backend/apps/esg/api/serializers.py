from rest_framework import serializers
from apps.esg.domain.models import EsgMetric, EsgTarget

class EsgMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = EsgMetric
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class EsgTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = EsgTarget
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

