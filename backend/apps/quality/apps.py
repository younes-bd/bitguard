from django.apps import AppConfig

class QualityConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.quality'
    verbose_name = 'Quality Management'

    def ready(self):
        self._register_kpis()
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.base.registry import register
        register('quality/', 'apps.quality.api.urls')


    def _register_kpis(self):
        try:
            from apps.base.registry import kpi_registry
            from apps.quality.services.kpi import get_kpis
            kpi_registry.register('quality_control', get_kpis)
        except ImportError:
            pass
