from django.apps import AppConfig

class TimeoffConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.timeoff'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.registry import register
        register('timeoff/', 'apps.timeoff.api.urls')

