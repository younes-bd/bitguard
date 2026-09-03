from django.apps import AppConfig

class FleetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.fleet'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('fleet/', 'apps.fleet.api.urls')

