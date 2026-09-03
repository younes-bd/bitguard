from django.apps import AppConfig


class MarketingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.marketing'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('marketing/', 'apps.marketing.api.urls')

