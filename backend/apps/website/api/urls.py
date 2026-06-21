from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnnouncementViewSet, 
    SignupViewSet, 
    WebsiteInquiryViewSet,
    SupportTicketView,
    RemoteSessionView,
    GenerateSessionView,
    GlobalSearchView
)

router = DefaultRouter()
router.register(r'announcements', AnnouncementViewSet)
router.register(r'signups', SignupViewSet)
router.register(r'inquiries', WebsiteInquiryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('support/ticket/', SupportTicketView.as_view(), name='support-ticket'),
    path('support/session/join/', RemoteSessionView.as_view(), name='session-join'),
    path('support/session/generate/', GenerateSessionView.as_view(), name='session-generate'),
    path('search/', GlobalSearchView.as_view(), name='global-search'),
]