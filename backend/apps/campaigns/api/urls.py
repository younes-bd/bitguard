from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.campaigns.api.views import CampaignViewSet, MailingListViewSet, MailingContactViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'lists', MailingListViewSet, basename='mailinglist')
router.register(r'contacts', MailingContactViewSet, basename='mailingcontact')

urlpatterns = [
    path('', include(router.urls)),
]
