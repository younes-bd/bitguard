from django.apps import AppConfig

class SignConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sign'
    verbose_name = 'E-Signatures'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('sign/', 'apps.sign.api.urls')
        register('contracts/', 'apps.sign.api.urls')

