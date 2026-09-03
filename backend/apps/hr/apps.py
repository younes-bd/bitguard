from django.apps import AppConfig

class HrConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.hr'
    label = 'hr'
    verbose_name = 'Human Resources'

    def ready(self):
        self._register_api_routes()
        import apps.hr.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('hr/', 'apps.hr.api.urls')

