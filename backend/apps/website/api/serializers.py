from rest_framework import serializers
from ..domain.models import (
    Announcement, Signup, WebsiteInquiry, LandingPage, Page, ServicePage, MediaAsset,
    Website, WebsiteMenu, WebsiteRedirect
)

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signup
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class WebsiteInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteInquiry
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class LandingPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPage
        fields = ['id', 'title', 'slug', 'campaign_slug', 'builder_json', 'seo_metadata', 'is_published', 'created_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ('tenant', 'created_by')

class ServicePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePage
        fields = '__all__'
        read_only_fields = ('tenant', 'author')

class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = '__all__'
        read_only_fields = ('tenant', 'uploaded_by')

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = '__all__'
        read_only_fields = ('tenant',)

class WebsiteMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteMenu
        fields = '__all__'
        read_only_fields = ('tenant',)

class WebsiteRedirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteRedirect
        fields = '__all__'
        read_only_fields = ('tenant',)
