from django.apps import AppConfig

class HrAttendanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.hr_attendance'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('hr_attendance/', 'apps.hr_attendance.api.urls')

