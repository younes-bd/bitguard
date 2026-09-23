from django.contrib import admin
try:
    from .domain.models import Notification, NotificationPreference, PushSubscription
    admin.site.register(Notification)
    admin.site.register(NotificationPreference)
    admin.site.register(PushSubscription)
except ImportError:
    pass
