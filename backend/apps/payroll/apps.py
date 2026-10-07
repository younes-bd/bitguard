from django.apps import AppConfig

class PayrollConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.payroll'

    def ready(self):
        self._register_api_routes()
        import apps.payroll.infrastructure.signals

    def _register_api_routes(self):
        from apps.base.registry import register
        register('payroll/', 'apps.payroll.api.urls')

