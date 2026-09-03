from django.apps import AppConfig

class PurchaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.purchase'
    verbose_name = 'Purchase Management'

    def ready(self):
        self._register_api_routes()
        try:
            import apps.purchase.infrastructure.signals
        except ImportError:
            pass

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('purchase/', 'apps.purchase.api.urls')

