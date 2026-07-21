from rest_framework import serializers
from apps.planning.domain.models import Shift, PlanningRole, ShiftTemplate

class PlanningRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanningRole
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')

class ShiftTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftTemplate
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')
