from .models import Notification
from apps.core.services.base import BaseService

class NotificationService(BaseService):
    """
    Centralized service for platform-wide notifications.
    Enforces tenant isolation and consistent delivery (Charter Section 8/10).
    """
    
    @staticmethod
    def create_notification(user, tenant, title, message, n_type='system', payload=None):
        """
        Creates a notification for a specific user and tenant.
        """
        return Notification.objects.create(
            user=user,
            tenant=tenant,
            title=title,
            message=message,
            type=n_type,
            payload=payload or {}
        )

    @staticmethod
    def mark_all_as_read(user, tenant):
        """
        Marks all notifications as read for a given user in a tenant context.
        """
        return Notification.objects.filter(
            user=user, 
            tenant=tenant, 
            is_read=False
        ).update(is_read=True)

    @classmethod
    def send_system_alert(cls, user, tenant, title, message):
        return cls.create_notification(user, tenant, title, message, n_type='system')

    @classmethod
    def send_security_warning(cls, user, tenant, title, message):
        return cls.create_notification(user, tenant, title, message, n_type='soc')
