from django.apps import AppConfig

class MrpPlmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.mrp_plm'
    verbose_name = 'Product Lifecycle Management'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('mrp_plm/', 'apps.mrp_plm.api.urls')

