"""
BitGuard Core API Registry
===========================
This is the singleton registry for all backend API routes.

The Core System has ZERO hardcoded knowledge of any downstream app or integration.
Instead, each app announces its own API routes by calling `register()` inside its
`AppConfig.ready()` method during the Django boot cycle.

The master router (`api/urls.py`) reads `get_registered_routes()` once at startup
and builds the final URL configuration from whatever is in this registry.

Architecture Rule #5 — Registry-Driven Plug-and-Play (Backend Global Registry Pattern)
"""

_registry = []


def register(url_prefix, url_module):
    """
    Called by each app's AppConfig.ready() to register its API routes.

    Args:
        url_prefix: The URL path prefix for this app (e.g., 'crm/', 'ai_agent/')
        url_module: The dotted Python module path to the app's urls.py
                    (e.g., 'apps.crm.api.urls')

    Example usage in an app's apps.py:
        def ready(self):
            from apps.core.api.registry import register
            register('crm/', 'apps.crm.api.urls')
    """
    if not url_prefix.endswith('/'):
        url_prefix = f"{url_prefix}/"

    # Guard against duplicate registrations (Django can trigger ready() more
    # than once in some test environments)
    entry = {'prefix': url_prefix, 'module': url_module}
    if entry not in _registry:
        _registry.append(entry)


def get_registered_routes():
    """
    Called once by the master router to retrieve all registered API routes.

    Returns:
        A list of dicts: [{'prefix': 'crm/', 'module': 'apps.crm.api.urls'}, ...]
    """
    return list(_registry)


def clear_registry():
    """
    Clears the registry. Used exclusively in test environments to reset state
    between test cases. Must NEVER be called in production code.
    """
    global _registry
    _registry = []
