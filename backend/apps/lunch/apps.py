from django.apps import AppConfig

class LunchConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.lunch'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('lunch/', 'apps.lunch.api.urls')

