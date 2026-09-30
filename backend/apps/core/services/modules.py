import os
import ast
from django.conf import settings
from apps.core.domain.models import InstalledModule

# Internal-only apps that are not user-facing modules
INTERNAL_APPS = {'__pycache__', 'auth', 'core', 'inbox', 'tenants', 'reports'}

def find_manifest(technical_name):
    apps_dir = os.path.join(settings.BASE_DIR, 'apps')
    manifest_path = os.path.join(apps_dir, technical_name, '__manifest__.py')
    return manifest_path if os.path.exists(manifest_path) else None

def read_manifest(manifest_path):
    with open(manifest_path, 'r', encoding='utf-8') as f:
        return ast.literal_eval(f.read())

def sync_modules(tenant=None):
    """
    Tier-1 Registry Scanner.
    Scans the backend/apps directory for __manifest__.py files
    and upserts InstalledModule records for the given tenant.
    It STRICTLY DISCOVERS apps (defaults to is_installed=False for new apps).
    It NEVER touches UI sections or business logic.
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
            if app_name in INTERNAL_APPS:
                continue

            app_path = os.path.join(d, app_name)
            manifest_path = os.path.join(app_path, '__manifest__.py')

            if not os.path.isdir(app_path) or not os.path.exists(manifest_path):
                continue

            try:
                manifest = read_manifest(manifest_path)

                if not isinstance(manifest, dict):
                    continue

                if not manifest.get('installable', False):
                    continue

                module, created = InstalledModule.objects.get_or_create(
                    tenant=tenant,
                    technical_name=app_name,
                    defaults={
                        'is_installed': False
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


def install_module(module, tenant=None):
    """
    Tier-1 Installer Hook.
    Transition a module from Uninstalled to Installed.
    Checks dependencies and writes to SystemEventLog.
    """
    if module.is_installed:
        return True, []
        
    unmet_deps = []
    if isinstance(module.depends, list):
        for dep_name in module.depends:
            # We don't check dependencies for internal modules, just standard installed ones
            if dep_name in INTERNAL_APPS:
                continue
            dep = InstalledModule.objects.filter(tenant=module.tenant, technical_name=dep_name).first()
            if not dep:
                unmet_deps.append(dep_name)
            elif not dep.is_installed:
                # Auto-install the dependency recursively
                success, nested_unmet = install_module(dep, tenant=tenant)
                if not success:
                    unmet_deps.append(dep_name)
    
    if unmet_deps:
        return False, unmet_deps
    
    module.is_installed = True
    module.save()
    
    try:
        from apps.core.domain.models import SystemEventLog
        SystemEventLog.objects.create(
            action='install_module',
            resource_type='InstalledModule',
            resource_id=str(module.id),
            details={'technical_name': module.technical_name},
            tenant=tenant
        )
    except Exception:
        pass
        
    return True, []

def upgrade_module(module, tenant=None):
    manifest_path = find_manifest(module.technical_name)
    if manifest_path:
        data = read_manifest(manifest_path)
        module.version = data.get('version', module.version)
        module.summary = data.get('summary', module.summary)
        module.description = data.get('description', module.description)
        module.save()
        
        try:
            from apps.core.domain.models import SystemEventLog
            SystemEventLog.objects.create(
                action='update',
                resource_type='InstalledModule',
                resource_id=str(module.id),
                details={'technical_name': module.technical_name, 'message': 'Module upgraded'},
                tenant=tenant
            )
        except Exception:
            pass
        return True, "Module upgraded"
    return False, "Manifest not found"

def uninstall_module(module, tenant=None):
    KERNEL_MODULES = ['core', 'system', 'auth', 'tenants', 'automation', 'apps', 'users']
    if module.technical_name in KERNEL_MODULES:
        return False, f"Cannot uninstall '{module.technical_name}'. It is a protected core kernel module required for the ERP to function."
    
    module.is_installed = False
    module.save()
    
    try:
        from apps.core.domain.models import SystemEventLog
        SystemEventLog.objects.create(
            action='uninstall_module',
            resource_type='InstalledModule',
            resource_id=str(module.id),
            details={'technical_name': module.technical_name},
            tenant=tenant
        )
    except Exception:
        pass
    
    return True, "Module uninstalled"
