from rest_framework import serializers
from apps.mrp_plm.domain.models import EngineeringChangeOrder, ECOType

class EngineeringChangeOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngineeringChangeOrder
        fields = '__all__'

class ECOTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ECOType
        fields = '__all__'

