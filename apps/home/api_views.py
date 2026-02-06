from rest_framework import viewsets, permissions
from .models import Announcement, Signup, WebsiteInquiry
from .serializers import AnnouncementSerializer, SignupSerializer, WebsiteInquirySerializer

class AnnouncementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Announcement.objects.all().order_by('-date')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]

class SignupViewSet(viewsets.ModelViewSet):
    # Public can sign up
    queryset = Signup.objects.all().order_by('-timestamp')
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class WebsiteInquiryViewSet(viewsets.ModelViewSet):
    # Public can submit inquiries
    queryset = WebsiteInquiry.objects.all().order_by('-created_at')
    serializer_class = WebsiteInquirySerializer
    permission_classes = [permissions.AllowAny]

from .models import ServicePage
from .serializers import ServicePageSerializer

class ServicePageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServicePage.objects.all().order_by('title')
    serializer_class = ServicePageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
