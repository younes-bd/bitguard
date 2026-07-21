from django.apps import AppConfig


class ItamConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.maintenance'
    verbose_name = 'IT Asset Management'

    def ready(self):
        import apps.maintenance.infrastructure.signals

