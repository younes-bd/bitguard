from django.apps import AppConfig

class SocConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.soc'

    def ready(self):
        self._register_api_routes()
        import apps.soc.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('soc/', 'apps.soc.api.urls')

