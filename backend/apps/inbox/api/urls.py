from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet
from apps.inbox.api.views import OutgoingMailServerViewSet, IncomingMailServerViewSet, EmailTemplateViewSet, MailAliasViewSet

router = DefaultRouter()
router.register(r'', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
