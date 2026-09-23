from django.apps import AppConfig


class JourneysConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.journeys'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.registry import register
        register('journeys/', 'apps.journeys.api.urls')

