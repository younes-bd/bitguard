# backend/apps/core/registry.py

# ==========================================
# 1. Global API Routing Registry
# ==========================================
_api_routes = []

def register(prefix: str, module: str):
    """
    Registers an app's API urls.py to the master API router.
    Example: register('crm/', 'apps.crm.api.urls')
    """
    _api_routes.append({'prefix': prefix, 'module': module})

def get_registered_routes():
    return _api_routes

# ==========================================
# 2. Scheduled Actions Registry
# ==========================================
_scheduled_actions_registry = []

def register_scheduled_action(config: dict):
    """
    Registers an in-memory background task blueprint.
    """
    if config not in _scheduled_actions_registry:
        _scheduled_actions_registry.append(config)

def get_registered_scheduled_actions():
    return _scheduled_actions_registry

# ==========================================
# 3. KPI Registry (Command Center)
# ==========================================
class KPIRegistry:
    def __init__(self):
        self._providers = {}
        
    def register(self, app_name, provider_func):
        self._providers[app_name] = provider_func
        
    def get_all_providers(self):
        return self._providers

kpi_registry = KPIRegistry()
