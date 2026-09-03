from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field='django.db.models.BigAutoField'
    name='apps.users'

    def ready(self):
        self._register_api_routes()
        import apps.users.infrastructure.signals

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('users/', 'apps.users.api.urls')

