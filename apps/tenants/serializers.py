from rest_framework import serializers
from .models import Tenant, Bundle

class BundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundle
        fields = '__all__'

class TenantSerializer(serializers.ModelSerializer):
    bundle = BundleSerializer(read_only=True)
    
    class Meta:
        model = Tenant
        fields = '__all__'
