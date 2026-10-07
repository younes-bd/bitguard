from django.apps import AppConfig

class ExpensesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.expenses'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.base.registry import register
        register('expenses/', 'apps.expenses.api.urls')

