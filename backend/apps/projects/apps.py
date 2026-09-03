from django.apps import AppConfig


class ProjectsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.projects'
    verbose_name = 'Project Management'

    def ready(self):
        self._register_api_routes()
        import apps.projects.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('projects/', 'apps.projects.api.urls')

