from django.apps import AppConfig

class HrPayrollConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.hr_payroll'

    def ready(self):
        self._register_api_routes()
        import apps.hr_payroll.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('hr_payroll/', 'apps.hr_payroll.api.urls')

