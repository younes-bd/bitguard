from django.apps import AppConfig

class HrRecruitmentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.hr_recruitment'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('hr_recruitment/', 'apps.hr_recruitment.api.urls')

