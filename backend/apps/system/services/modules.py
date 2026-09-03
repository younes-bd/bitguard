import os
import ast
from django.conf import settings
from apps.system.domain.models import InstalledModule

# Internal-only apps that are not user-facing modules
INTERNAL_APPS = {'__pycache__', 'auth', 'core', 'notifications', 'tenants', 'reporting'}

def find_manifest(technical_name):
    apps_dir = os.path.join(settings.BASE_DIR, 'apps')
    manifest_path = os.path.join(apps_dir, technical_name, '__manifest__.py')
    return manifest_path if os.path.exists(manifest_path) else None

def read_manifest(manifest_path):
    with open(manifest_path, 'r', encoding='utf-8') as f:
        return ast.literal_eval(f.read())

def sync_modules(tenant=None):
    """
    Scans the backend/apps directory for __manifest__.py files
    and upserts InstalledModule records for the given tenant.
    All installable apps are synced (application flag no longer gates).
    """
    apps_dir = os.path.join(settings.BASE_DIR, 'apps')
    integrations_dir = os.path.join(settings.BASE_DIR, 'integrations')
    modules_found = 0

    scan_dirs = []
    if os.path.exists(apps_dir):
        scan_dirs.append(apps_dir)
    if os.path.exists(integrations_dir):
        scan_dirs.append(integrations_dir)

    if not scan_dirs:
        return modules_found

    for d in scan_dirs:
        for app_name in sorted(os.listdir(d)):
            # Skip internal/infrastructure apps — not user-facing modules
            if app_name in INTERNAL_APPS:
                continue

            app_path = os.path.join(d, app_name)
            manifest_path = os.path.join(app_path, '__manifest__.py')

            if not os.path.isdir(app_path) or not os.path.exists(manifest_path):
                continue

            # ↓ try/except MUST be inside the inner for-loop (was incorrectly de-indented)
            try:
                manifest = read_manifest(manifest_path)

                if not isinstance(manifest, dict):
                    continue

                if not manifest.get('installable', False):
                    continue

                section_name = manifest.get('command_center_section', 'Other')
                # Auto-register the section in the database (Tier-1 Standard)
                from apps.system.domain.models import CommandCenterSection
                CommandCenterSection.objects.get_or_create(
                    tenant=tenant,
                    name=section_name,
                    defaults={'sequence': 99}
                )

                module, created = InstalledModule.objects.get_or_create(
                    tenant=tenant,
                    technical_name=app_name,
                    defaults={
                        'is_installed': True if app_name in ['apps', 'system', 'base', 'core'] else False,
                    }
                )
                
                module.name = manifest.get('name', app_name.replace('_', ' ').title())
                module.display_name = manifest.get('display_name', manifest.get('name', app_name.replace('_', ' ').title()))
                module.author = manifest.get('author', 'BitGuard')
                module.version = manifest.get('version', '1.0')
                module.category = manifest.get('category', 'Other')
                module.command_center_section = manifest.get('command_center_section', '')
                module.sequence = manifest.get('sequence', 99)
                module.summary = manifest.get('summary', '')
                module.description = manifest.get('description', '')
                module.icon = manifest.get('icon', 'Box')
                module.depends = manifest.get('depends', [])
                module.installable = True
                
                if app_name in ['apps', 'system', 'base', 'core']:
                    module.is_installed = True
                    
                module.application = manifest.get('application', True)
                module.url = manifest.get('url', f'/admin/{app_name}')
                module.website = manifest.get('website', '')
                module.license = manifest.get('license', 'LGPL-3')
                module.rating = float(manifest.get('rating', 0.0))
                module.featured = bool(manifest.get('featured', False))
                module.screenshots = manifest.get('screenshots', [])
                module.save()
                modules_found += 1
            except Exception as e:
                print(f"Failed to load manifest for {app_name}: {e}")

    return modules_found
