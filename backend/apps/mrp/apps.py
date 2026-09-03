from django.apps import AppConfig

class MrpConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.mrp'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('mrp/', 'apps.mrp.api.urls')

