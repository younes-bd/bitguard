from django.apps import AppConfig

class PurchaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.purchase'
    verbose_name = 'Purchase Management'

    def ready(self):
        try:
            import apps.purchase.infrastructure.signals
        except ImportError:
            pass
