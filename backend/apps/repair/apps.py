from django.apps import AppConfig

class RepairConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.repair'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('repair/', 'apps.repair.api.urls')

