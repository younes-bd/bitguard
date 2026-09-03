from django.apps import AppConfig

class SMSConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sms'
    label = 'sms'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('sms/', 'apps.sms.api.urls')

