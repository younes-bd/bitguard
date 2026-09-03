from django.apps import AppConfig

class SpreadsheetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.spreadsheet'
    label = 'spreadsheet'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('spreadsheet/', 'apps.spreadsheet.api.urls')

