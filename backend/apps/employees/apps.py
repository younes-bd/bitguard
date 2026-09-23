from django.apps import AppConfig

class EmployeesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.employees'
    label = 'employees'
    verbose_name = 'Human Resources'

    def ready(self):
        self._register_kpis()
        self._register_api_routes()
        self._register_automations()
        import apps.employees.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.registry import register
        register('employees/', 'apps.employees.api.urls')

    def _register_automations(self):
        from apps.core.registry import register_scheduled_action
        register_scheduled_action({
            'key': 'employee_appraisal_reminder',
            'model_name': 'employees.Appraisal',
            'method_name': 'send_reminders',
            'title': 'Appraisal Reminders',
            'icon': 'Users',
            'interval_number': 7,
            'interval_type': 'days',
            'desc': 'Send automated email reminders for upcoming performance appraisals.'
        })


    def _register_kpis(self):
        try:
            from apps.core.registry import kpi_registry
            from apps.employees.services.kpi import get_kpis
            kpi_registry.register('hr', get_kpis)
        except ImportError:
            pass
