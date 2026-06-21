from django.contrib import admin
from .models import Channel, ChannelMember, Message

@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_private', 'tenant')
    search_fields = ('name',)
    list_filter = ('is_private', 'tenant')

@admin.register(ChannelMember)
class ChannelMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'channel', 'role', 'tenant')
    list_filter = ('role', 'tenant')
    search_fields = ('user__username', 'channel__name')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'channel', 'content', 'created_at', 'tenant')
    list_filter = ('channel', 'tenant', 'created_at')
    search_fields = ('content', 'sender__username', 'channel__name')
