from django.apps import AppConfig

class HrmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.hr'
    label = 'hrm'
    verbose_name = 'Human Resources'

    def ready(self):
        import apps.hr.infrastructure.signals

