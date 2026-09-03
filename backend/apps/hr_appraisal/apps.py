from django.apps import AppConfig

class HrAppraisalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.hr_appraisal'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('hr_appraisal/', 'apps.hr_appraisal.api.urls')

