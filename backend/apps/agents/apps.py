from django.apps import AppConfig

class AgentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.agents'
    label = 'agents'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.registry import register
        register('agents/', 'apps.agents.urls')


