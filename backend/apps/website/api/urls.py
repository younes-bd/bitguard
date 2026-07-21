from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnnouncementViewSet, 
    SignupViewSet, 
    WebsiteInquiryViewSet,
    LandingPageViewSet,
    PageViewSet,
    ServicePageViewSet,
    MediaAssetViewSet,
    WebsiteViewSet,
    WebsiteMenuViewSet,
    WebsiteRedirectViewSet,
    SupportTicketView,
    RemoteSessionView,
    GenerateSessionView,
    GlobalSearchView
)

router = DefaultRouter()
router.register(r'announcements', AnnouncementViewSet)
router.register(r'signups', SignupViewSet)
router.register(r'inquiries', WebsiteInquiryViewSet)
router.register(r'landing-pages', LandingPageViewSet, basename='landingpage')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'service-pages', ServicePageViewSet, basename='servicepage')
router.register(r'media-assets', MediaAssetViewSet, basename='mediaasset')
router.register(r'websites', WebsiteViewSet, basename='website')
router.register(r'menus', WebsiteMenuViewSet, basename='websitemenu')
router.register(r'redirects', WebsiteRedirectViewSet, basename='websiteredirect')

urlpatterns = [
    path('', include(router.urls)),
    path('support/ticket/', SupportTicketView.as_view(), name='support-ticket'),
    path('support/session/join/', RemoteSessionView.as_view(), name='session-join'),
    path('support/session/generate/', GenerateSessionView.as_view(), name='session-generate'),
    path('search/', GlobalSearchView.as_view(), name='global-search'),
]
