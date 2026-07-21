from django.apps import AppConfig

class BaseSetupConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.base_setup'
    verbose_name = 'System Administration'
