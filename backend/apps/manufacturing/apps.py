from django.apps import AppConfig

class ManufacturingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.manufacturing'

    def ready(self):
        self._register_kpis()
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.registry import register
        register('manufacturing/', 'apps.manufacturing.api.urls')


    def _register_kpis(self):
        try:
            from apps.core.registry import kpi_registry
            from apps.manufacturing.services.kpi import get_kpis
            kpi_registry.register('mrp', get_kpis)
        except ImportError:
            pass
