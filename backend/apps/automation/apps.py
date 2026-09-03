from django.apps import AppConfig

class AutomationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.automation'
    label = 'automation'

    def ready(self):
        self._register_api_routes()
        import apps.automation.domain.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('automation/', 'apps.automation.api.urls')

