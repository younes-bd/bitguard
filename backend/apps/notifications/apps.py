from django.apps import AppConfig

class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.notifications'

    def ready(self):
        self._register_api_routes()
        import apps.notifications.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('notifications/', 'apps.notifications.api.urls')

