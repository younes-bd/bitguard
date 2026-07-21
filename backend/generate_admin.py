import os
import sys
import django

sys.path.append('/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

django.setup()

from django.apps import apps
from django.db import models

apps_to_update = ['accounting', 'services', 'maintenance', 'projects', 'purchase', 'inventory']

for app_name in apps_to_update:
    try:
        app_config = apps.get_app_config(app_name)
    except LookupError:
        print(f"App {app_name} not found.")
        continue
        
    admin_file_path = os.path.join(app_config.path, 'admin.py')
    
    # Get all models
    app_models = app_config.get_models()
    model_names = [m.__name__ for m in app_models if not m._meta.abstract]
    
    if not model_names:
        print(f"No models for {app_name}.")
        continue
        
    print(f"Generating admin for {app_name} with {len(model_names)} models...")
    
    content = f"""from django.contrib import admin
from .domain import models

# Auto-generated Admin for {app_name}

"""
    
    for model_name in model_names:
        content += f"""@admin.register(models.{model_name})
class {model_name}Admin(admin.ModelAdmin):
    pass

"""
        
    with open(admin_file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Admin generation complete.")
