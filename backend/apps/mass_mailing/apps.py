from django.apps import AppConfig

class MassMailingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.mass_mailing'
    label = 'mass_mailing'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('mass_mailing/', 'apps.mass_mailing.api.urls')

