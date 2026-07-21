from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChannelViewSet, MessageViewSet, LiveChatChannelViewSet

router = DefaultRouter()
router.register(r'channels', ChannelViewSet, basename='discuss-channel')
router.register(r'messages', MessageViewSet, basename='discuss-message')
router.register(r'livechat', LiveChatChannelViewSet, basename='discuss-livechat')

urlpatterns = [
    path('', include(router.urls)),
]
