from django.apps import AppConfig

class PerformanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.performance'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.registry import register
        register('performance/', 'apps.performance.api.urls')

