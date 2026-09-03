from rest_framework import serializers
from apps.equity.domain.models import ShareClass, Shareholder

class ShareClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareClass
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class ShareholderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shareholder
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

