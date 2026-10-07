from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.base'

    def ready(self):
        self._register_api_routes()
        

    def _register_api_routes(self):
        from apps.base.registry import register
        register('base/', 'apps.base.api.urls')


