from rest_framework import serializers
from apps.quality_control.domain.models import QualityAlert, QualityPoint, QualityCheck

class QualityAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityAlert
        fields = '__all__'

class QualityPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityPoint
        fields = '__all__'

class QualityCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityCheck
        fields = '__all__'
