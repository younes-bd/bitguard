from django.apps import AppConfig

class EsgConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.esg'
    verbose_name = 'ESG Tracking'

    def ready(self):
        self._register_api_routes()
        import apps.esg.infrastructure.signals  # noqa

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('esg/', 'apps.esg.api.urls')

