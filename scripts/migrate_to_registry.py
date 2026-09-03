#!/usr/bin/env python3
"""
BitGuard -- Migrate to Global Registry Pattern
=============================================
This script updates every app's apps.py to self-register its API routes
into the Core Registry instead of relying on the old filesystem-crawling
master router.

Run from the workspace root:
    python3 scripts/migrate_to_registry.py

Architecture Rule 5 -- Registry-Driven Plug-and-Play
"""
import os

BACKEND_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
)

# Apps with a custom URL prefix (not just their folder name)
CUSTOM_PREFIXES = {
    'website': 'home/',
}

# Apps that register under MORE than one URL prefix (aliases)
URL_ALIASES = {
    'sign': ['contracts/'],
}

# Kernel-only apps that expose zero API routes -- skip them
SKIP_API_APPS = {'core', 'tenants', 'automation', 'studio', 'barcode', 'iot', 'portal'}

updated = []
skipped_no_urls = []
skipped_already_done = []
errors = []


def process_module(apps_py_path, app_name, urls_module):
    """Inject registry self-registration into an apps.py file."""
    with open(apps_py_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Guard: already migrated?
    if 'core.api.registry' in content:
        skipped_already_done.append(app_name)
        return

    url_prefix = CUSTOM_PREFIXES.get(app_name, app_name + '/')
    aliases = URL_ALIASES.get(app_name, [])

    alias_lines = ''.join(
        ["\n        register('%s', '%s')" % (a, urls_module) for a in aliases]
    )

    register_block = (
        "\n    def _register_api_routes(self):\n"
        "        from apps.core.api.registry import register\n"
        "        register('%s', '%s')%s\n" % (url_prefix, urls_module, alias_lines)
    )

    # Inject the self._register_api_routes() call into the existing ready() method,
    # or create a ready() method if the app does not have one yet.
    if 'def ready(self):' in content:
        content = content.replace(
            'def ready(self):',
            'def ready(self):\n        self._register_api_routes()'
        )
    else:
        content = content.rstrip() + '\n\n    def ready(self):\n        self._register_api_routes()\n'

    content = content.rstrip() + '\n' + register_block + '\n'

    with open(apps_py_path, 'w', encoding='utf-8') as f:
        f.write(content)

    updated.append('%s  ->  %s' % (app_name, url_prefix))


def scan_pillar(pillar_dir, pillar_prefix):
    """Scan an apps/ or integrations/ pillar directory for modules."""
    if not os.path.isdir(pillar_dir):
        return

    for app_name in sorted(os.listdir(pillar_dir)):
        app_dir = os.path.join(pillar_dir, app_name)

        if not os.path.isdir(app_dir) or app_name.startswith('__') or app_name.startswith('.'):
            continue

        if app_name in SKIP_API_APPS:
            skipped_no_urls.append('%s (kernel -- no API urls)' % app_name)
            continue

        apps_py = os.path.join(app_dir, 'apps.py')
        if not os.path.isfile(apps_py):
            errors.append('%s: missing apps.py!' % app_name)
            continue

        # Standard location: api/urls.py (preferred)
        api_urls = os.path.join(app_dir, 'api', 'urls.py')
        # Legacy location: root urls.py (Phase 5 will move these for integrations)
        root_urls = os.path.join(app_dir, 'urls.py')

        if os.path.isfile(api_urls):
            urls_module = '%s.%s.api.urls' % (pillar_prefix, app_name)
        elif os.path.isfile(root_urls):
            urls_module = '%s.%s.urls' % (pillar_prefix, app_name)
        else:
            skipped_no_urls.append('%s (no urls.py found)' % app_name)
            continue

        try:
            process_module(apps_py, app_name, urls_module)
        except Exception as e:
            errors.append('%s: %s' % (app_name, str(e)))


# -- Execute -------------------------------------------------------------------
scan_pillar(os.path.join(BACKEND_DIR, 'apps'), 'apps')
scan_pillar(os.path.join(BACKEND_DIR, 'integrations'), 'integrations')

# -- Report --------------------------------------------------------------------
print('\n' + '=' * 60)
print('BitGuard Registry Migration Report')
print('=' * 60)

print('\nUPDATED (%d):' % len(updated))
for i in updated:
    print('  + ' + i)

print('\nALREADY MIGRATED (%d):' % len(skipped_already_done))
for i in skipped_already_done:
    print('  = ' + i)

print('\nSKIPPED -- No URL module (%d):' % len(skipped_no_urls))
for i in skipped_no_urls:
    print('  - ' + i)

print('\nERRORS (%d):' % len(errors))
for i in errors:
    print('  ! ' + i)

print('\n' + '=' * 60)
print('Done. Run manage.py check in backend/ to verify.')
print('=' * 60 + '\n')
