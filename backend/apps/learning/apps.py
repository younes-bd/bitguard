from django.apps import AppConfig

class LearningConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.learning'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.base.registry import register
        register('learning/', 'apps.learning.api.urls')

