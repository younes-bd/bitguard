from rest_framework import serializers
from apps.appointments.domain.models import Appointment, AppointmentType, AppointmentResource

class AppointmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentType
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')

class AppointmentResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentResource
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')
