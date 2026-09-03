from django.apps import AppConfig
class WebsiteConfig(AppConfig):
    default_auto_field='django.db.models.BigAutoField'
    name='apps.website'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('home/', 'apps.website.api.urls')

