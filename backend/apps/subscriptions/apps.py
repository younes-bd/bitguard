from django.apps import AppConfig

class SubscriptionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.subscriptions'
    verbose_name = 'Subscriptions'

    def ready(self):
        self._register_api_routes()
        import apps.subscriptions.infrastructure.signals  # noqa

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('subscriptions/', 'apps.subscriptions.api.urls')

