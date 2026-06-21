from rest_framework import serializers
from ..domain.models import Announcement, Signup, WebsiteInquiry

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


