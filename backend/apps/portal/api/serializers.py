from rest_framework import serializers
from ..domain.models import PortalAccess, PortalShare

class PortalAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalAccess
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class PortalShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalShare
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
