from django.apps import AppConfig

class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inbox'

    def ready(self):
        self._register_api_routes()
        import apps.inbox.infrastructure.signals

    def _register_api_routes(self):
        from apps.base.registry import register
        register('inbox/', 'apps.inbox.api.urls')

