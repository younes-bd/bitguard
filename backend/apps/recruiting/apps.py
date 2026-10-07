from django.apps import AppConfig

class RecruitingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.recruiting'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.base.registry import register
        register('recruiting/', 'apps.recruiting.api.urls')

