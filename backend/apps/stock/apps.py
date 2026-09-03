from django.apps import AppConfig

class StockConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.stock'

    def ready(self):
        self._register_api_routes()
        try:
            import apps.stock.infrastructure.signals
        except ImportError:
            pass

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('stock/', 'apps.stock.api.urls')

