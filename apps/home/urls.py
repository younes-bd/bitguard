from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnnouncementViewSet, 
    SignupViewSet, 
    WebsiteInquiryViewSet, 
    ServicePageViewSet,
    SupportTicketView,
    RemoteSessionView,
    GenerateSessionView,
    ClientDashboardView
)

router = DefaultRouter()
router.register(r'announcements', AnnouncementViewSet)
router.register(r'signups', SignupViewSet)
router.register(r'inquiries', WebsiteInquiryViewSet)
router.register(r'services', ServicePageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('support/ticket/', SupportTicketView.as_view(), name='support-ticket'),
    path('support/session/join/', RemoteSessionView.as_view(), name='session-join'),
    path('support/session/generate/', GenerateSessionView.as_view(), name='session-generate'),
    path('dashboard/', ClientDashboardView.as_view(), name='client-dashboard'),
]