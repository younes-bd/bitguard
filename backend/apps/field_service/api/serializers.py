from rest_framework import serializers
from ..domain.models import FieldIntervention

class FieldInterventionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldIntervention
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')
