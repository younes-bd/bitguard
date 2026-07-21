from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class Channel(TenantAwareModel):
    name = models.CharField(max_length=255)
    channel_type = models.CharField(max_length=20, choices=[('public', 'Public'), ('private', 'Private'), ('chat', 'Direct Message'), ('livechat', 'LiveChat')], default='public')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='discuss_channels')

    class Meta:
        app_label = 'discuss'

class Message(TenantAwareModel):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='discuss_messages', null=True, blank=True)
    body = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'discuss'

class LiveChatChannel(TenantAwareModel):
    website = models.ForeignKey('website.Website', on_delete=models.CASCADE, null=True, blank=True, related_name='livechat_channels')
    name = models.CharField(max_length=255)
    welcome_message = models.TextField(blank=True, default="How can we help you?")
    button_text = models.CharField(max_length=50, default="Chat with us")
    button_color = models.CharField(max_length=50, default="#3b82f6")
    
    class Meta:
        app_label = 'discuss'
