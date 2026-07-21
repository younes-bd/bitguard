from django.contrib import admin
from apps.discuss.domain.models import Channel, Message

admin.site.register(Channel)
admin.site.register(Message)
