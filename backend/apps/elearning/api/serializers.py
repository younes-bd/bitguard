from rest_framework import serializers
from ..domain.models import Course, Content, Forum, CourseCertification, Review

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('tenant', 'created_by')

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = '__all__'
        read_only_fields = ('tenant',)

class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = '__all__'
        read_only_fields = ('tenant',)

class CourseCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCertification
        fields = '__all__'
        read_only_fields = ('tenant',)

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('tenant', 'user')
