from django.apps import AppConfig
class StoreConfig(AppConfig):
    default_auto_field='django.db.models.BigAutoField'
    name='apps.ecommerce'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('ecommerce/', 'apps.ecommerce.api.urls')

