from django.apps import AppConfig

class LivechatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.livechat'
    label = 'livechat'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('livechat/', 'apps.livechat.api.urls')

