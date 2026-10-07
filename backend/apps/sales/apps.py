from django.apps import AppConfig

class SalesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sales'
    
    def ready(self):
        self._register_kpis()
        self._register_api_routes()
        import apps.sales.infrastructure.signals

    def ready(self):
        self._register_kpis()
        self._register_api_routes()
        import apps.sales.infrastructure.signals

    def _register_api_routes(self):
        from apps.base.registry import register
        register('sales/', 'apps.sales.api.urls')


    def _register_kpis(self):
        try:
            from apps.base.registry import kpi_registry
            from apps.sales.services.kpi import get_kpis
            kpi_registry.register('sale', get_kpis)
        except ImportError:
            pass
