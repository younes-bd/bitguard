from django.apps import AppConfig


class HelpdeskConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.helpdesk'

    def ready(self):
        self._register_api_routes()
        import apps.helpdesk.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('helpdesk/', 'apps.helpdesk.api.urls')

