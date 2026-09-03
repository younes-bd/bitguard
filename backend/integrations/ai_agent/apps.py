from django.apps import AppConfig

class AIAgentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'integrations.ai_agent'
    label = 'ai_agent'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('ai_agent/', 'integrations.ai_agent.urls')

