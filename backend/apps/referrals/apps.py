from django.apps import AppConfig

class ReferralsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.referrals'
    label = 'referrals'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('referrals/', 'apps.referrals.api.urls')

