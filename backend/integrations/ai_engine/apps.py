from django.apps import AppConfig

class AIEngineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'integrations.ai_engine'
    label = 'ai_engine'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('ai_engine/', 'integrations.ai_engine.api.urls')
