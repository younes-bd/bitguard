from django.apps import AppConfig

class EquityConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.equity'
    verbose_name = 'Equity Management'

    def ready(self):
        self._register_api_routes()
        import apps.equity.infrastructure.signals  # noqa

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('equity/', 'apps.equity.api.urls')

