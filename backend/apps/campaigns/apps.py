from django.apps import AppConfig

class MassMailingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.campaigns'
    label = 'campaigns'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.registry import register
        register('campaigns/', 'apps.campaigns.api.urls')

