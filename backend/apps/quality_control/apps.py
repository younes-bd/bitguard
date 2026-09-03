from django.apps import AppConfig

class QualityControlConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.quality_control'
    verbose_name = 'Quality Management'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('quality_control/', 'apps.quality_control.api.urls')

