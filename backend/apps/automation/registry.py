"""
BitGuard Automation Blueprint Registry
========================================
Location: apps/automation/registry.py

The automation module is the background task Shared Utility engine.
It provides this registry as the bulletin board for automation blueprints.
Downstream business plugins (accounting, crm, stock, hr) post their own
automation blueprints here during the Django boot cycle via AppConfig.ready().

The HTTP endpoint (AutomationsRegistryViewSet in automation/api/views.py)
reads this registry and serves the list to the frontend Settings UI.

Architecture Rule 5  — Registry-Driven Plug-and-Play
Architecture Rule 9B — automation is a Shared Utility, not Kernel
Architecture Rule 20 — Registries live at their module root, not inside sublayers
"""

_automation_registry = []


def register_automation(config: dict):
    if config not in _automation_registry:
        _automation_registry.append(config)


def get_registered_automations():
    return list(_automation_registry)


def clear_automation_registry():
    global _automation_registry
    _automation_registry = []
