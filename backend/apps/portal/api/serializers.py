from rest_framework import serializers
from ..domain.models import PortalAccess, PortalShare

class PortalAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalAccess
        fields = '__all__'

class PortalShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalShare
        fields = '__all__'
