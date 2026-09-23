import os
import ast
from apps.core.domain.models import InstalledModule

apps_dir = os.path.join('apps')
count = 0
for app_name in os.listdir(apps_dir):
    manifest_path = os.path.join(apps_dir, app_name, '__manifest__.py')
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, 'r', encoding='utf-8') as f:
                manifest_str = f.read()
                manifest_data = ast.literal_eval(manifest_str)
                
            technical_name = manifest_data.get('technical_name', app_name)
            has_settings = manifest_data.get('has_settings', False)
            settings_url = manifest_data.get('settings_url', '')
            settings_desc = manifest_data.get('settings_desc', '')
            
            qs = InstalledModule.objects.filter(technical_name=technical_name)
            for mod in qs:
                mod.has_settings = has_settings
                mod.settings_url = settings_url
                mod.settings_desc = settings_desc
                mod.save(update_fields=['has_settings', 'settings_url', 'settings_desc'])
                count += 1
                print(f'Synced {technical_name} -> has_settings={has_settings}')
        except Exception as e:
            print(e)
            pass

print(f'Total updated: {count}')
