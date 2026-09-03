from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'

    def ready(self):
        self._register_api_routes()
        import apps.core.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('core/', 'apps.core.api.urls')


