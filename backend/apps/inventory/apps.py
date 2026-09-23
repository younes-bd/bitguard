from django.apps import AppConfig

class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inventory'

    def ready(self):
        self._register_kpis()
        self._register_api_routes()
        self._register_automations()
        try:
            import apps.inventory.infrastructure.signals
        except ImportError:
            pass

    def _register_api_routes(self):
        from apps.core.registry import register
        register('inventory/', 'apps.inventory.api.urls')

    def _register_automations(self):
        from apps.core.registry import register_scheduled_action
        register_scheduled_action({
            'key': 'stock_reordering',
            'model_name': 'inventory.Warehouse',
            'method_name': 'run_reordering_rules',
            'title': 'Warehouse Reordering',
            'icon': 'Package',
            'interval_number': 1,
            'interval_type': 'days',
            'desc': 'Automatically create purchase orders for low stock items.'
        })


    def _register_kpis(self):
        try:
            from apps.core.registry import kpi_registry
            from apps.inventory.services.kpi import get_kpis
            kpi_registry.register('stock', get_kpis)
        except ImportError:
            pass
