from rest_framework import serializers
from .models import Announcement, Signup, WebsiteInquiry

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signup
        fields = '__all__'

class WebsiteInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteInquiry
        fields = '__all__'

from .models import ServicePage

class ServicePageSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(source='linked_service.base_price', max_digits=10, decimal_places=2, read_only=True)
    service_type = serializers.CharField(source='linked_service.service_type', read_only=True)
    erp_service_id = serializers.IntegerField(source='linked_service.id', read_only=True)

    class Meta:
        model = ServicePage
        fields = ['id', 'slug', 'title', 'subtitle', 'description', 'icon', 'hero_bg', 'hero_image', 'content', 'features', 'price', 'service_type', 'erp_service_id']
