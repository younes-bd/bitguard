import os
import re

base_path = "/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps"
apps_to_update = ['mrp', 'pos', 'fleet']

for app_name in apps_to_update:
    models_path = os.path.join(base_path, app_name, 'domain', 'models.py')
    if not os.path.exists(models_path):
        models_path = os.path.join(base_path, app_name, 'models.py')
    
    if not os.path.exists(models_path):
        print(f"No models.py found for {app_name}")
        continue
        
    with open(models_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    classes = re.findall(r'^class\s+([A-Za-z0-9_]+)\(', content, re.MULTILINE)
    classes = [c for c in classes if c not in ('Meta', 'BaseModel', 'TenantAwareModel')]
    
    if not classes:
        print(f"No models found for {app_name}")
        continue
        
    print(f"Generating admin for {app_name} with {len(classes)} models: {classes}")
    
    admin_content = f"""from django.contrib import admin
from . import models

# Auto-generated Admin for {app_name}

"""
    for c in classes:
        admin_content += f"""@admin.register(models.{c})
class {c}Admin(admin.ModelAdmin):
    pass

"""

    admin_path = os.path.join(base_path, app_name, 'admin.py')
    with open(admin_path, 'w', encoding='utf-8') as f:
        f.write(admin_content)
        
print("Fast admin generation complete.")
