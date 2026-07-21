from django.apps import AppConfig


class HelpdeskConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.helpdesk'

    def ready(self):
        import apps.helpdesk.infrastructure.signals
