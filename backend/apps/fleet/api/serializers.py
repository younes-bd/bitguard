from rest_framework import serializers
from apps.fleet.domain.models import Vehicle, VehicleLog, VehicleContract

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class VehicleLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleLog
        fields = '__all__'

class VehicleContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleContract
        fields = '__all__'

