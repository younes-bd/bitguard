from rest_framework import serializers
from ..domain.models import ServicePage, Page, MediaAsset

class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = ['id', 'file', 'filename', 'file_type', 'file_size', 'dimensions', 'alt_text', 'uploaded_by', 'created_at']
        read_only_fields = ['file_size', 'file_type', 'dimensions', 'uploaded_by']

class ServicePageSerializer(serializers.ModelSerializer):
    price = serializers.ReadOnlyField(source='linked_service.base_price')
    service_type = serializers.ReadOnlyField(source='linked_service.service_type')
    erp_service_id = serializers.ReadOnlyField(source='linked_service.id')

    class Meta:
        model = ServicePage
        fields = ['id', 'slug', 'title', 'subtitle', 'description', 'icon', 'hero_bg', 'hero_image', 'content', 'features', 'content_data', 'price', 'service_type', 'erp_service_id', 'status', 'published_at', 'author', 'version', 'meta_title', 'meta_description', 'og_image']

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'seo_title', 'seo_description', 'status', 'published_at', 'author', 'version', 'meta_title', 'meta_description', 'og_image', 'created_at']
