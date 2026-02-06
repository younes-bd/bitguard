from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import AnnouncementViewSet, SignupViewSet, WebsiteInquiryViewSet

router = DefaultRouter()
router.register(r'announcements', AnnouncementViewSet)
router.register(r'signups', SignupViewSet)
router.register(r'inquiries', WebsiteInquiryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
