from rest_framework import serializers
from apps.hr_appraisal.domain.models import Appraisal, PerformanceAppraisal, PerformanceReview

class AppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appraisal
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class PerformanceAppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceAppraisal
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class PerformanceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

