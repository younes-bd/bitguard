from django.apps import AppConfig


class ItamConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.maintenance'
    verbose_name = 'IT Asset Management'

    def ready(self):
        self._register_api_routes()
        import apps.maintenance.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('maintenance/', 'apps.maintenance.api.urls')

