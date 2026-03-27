from django.apps import AppConfig

class SocConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.soc'

    def ready(self):
        import apps.soc.signals
