from django.apps import AppConfig

class DispatchConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.dispatch'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.base.registry import register
        register('dispatch/', 'apps.dispatch.api.urls')

