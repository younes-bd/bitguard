from django.apps import AppConfig

class RentalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.rental'
    verbose_name = 'Rental Management'

    def ready(self):
        self._register_api_routes()

    def _register_api_routes(self):
        from apps.core.api.registry import register
        register('rental/', 'apps.rental.api.urls')

