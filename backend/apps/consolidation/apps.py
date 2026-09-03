from django.apps import AppConfig

class ConsolidationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.consolidation'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('consolidation/', 'apps.consolidation.api.urls')

