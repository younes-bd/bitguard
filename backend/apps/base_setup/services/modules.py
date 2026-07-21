import os
import ast
from django.conf import settings
from apps.base_setup.domain.models import ErpModule

def sync_modules(tenant=None):
    """
    Scans the backend/apps directory for __manifest__.py files
    and upserts ErpModule records for the given tenant.
    """
    apps_dir = os.path.join(settings.BASE_DIR, 'apps')
    modules_found = 0
    
    if not os.path.exists(apps_dir):
        return modules_found
        
    for app_name in os.listdir(apps_dir):
        app_path = os.path.join(apps_dir, app_name)
        manifest_path = os.path.join(app_path, '__manifest__.py')
        
        if not os.path.isdir(app_path) or not os.path.exists(manifest_path):
            continue
            
        try:
            with open(manifest_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Safely parse the python dict
                manifest = ast.literal_eval(content)
                
            if isinstance(manifest, dict):
                if manifest.get('installable') is not True or manifest.get('application') is not True:
                    continue
                    
                module, created = ErpModule.objects.update_or_create(
                    tenant=tenant,
                    technical_name=app_name,
                    defaults={
                        'name': manifest.get('name', app_name),
                        'author': manifest.get('author', ''),
                        'version': manifest.get('version', '1.0'),
                        'category': manifest.get('category', 'Uncategorized'),
                        'summary': manifest.get('summary', ''),
                        'description': manifest.get('description', ''),
                        'icon': manifest.get('icon', 'Box'),
                        'depends': manifest.get('depends', []),
                        'installable': manifest.get('installable', True),
                        'application': manifest.get('application', True),
                    }
                )
                modules_found += 1
        except Exception as e:
            print(f"Failed to load manifest for {app_name}: {e}")
            
    return modules_found
