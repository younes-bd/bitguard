from django.apps import AppConfig

class AccountingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounting'

    def ready(self):
        self._register_api_routes()
        import apps.accounting.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('accounting/', 'apps.accounting.api.urls')

