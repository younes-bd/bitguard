from django.apps import AppConfig

class PurchaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.procurement'
    verbose_name = 'Purchase Management'

    def ready(self):
        self._register_api_routes()
        try:
            import apps.procurement.infrastructure.signals
        except ImportError:
            pass

    def _register_api_routes(self):
        from apps.core.registry import register
        register('procurement/', 'apps.procurement.api.urls')

