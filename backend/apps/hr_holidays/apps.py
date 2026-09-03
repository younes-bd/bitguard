from django.apps import AppConfig

class HrHolidaysConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.hr_holidays'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('hr_holidays/', 'apps.hr_holidays.api.urls')

