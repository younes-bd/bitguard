from django.apps import AppConfig

class CrmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.crm'

    def ready(self):
        self._register_api_routes()
        import apps.crm.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('crm/', 'apps.crm.api.urls')

