import os

base_path = "/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps"
new_apps = ['mrp', 'pos', 'fleet']

for app in new_apps:
    app_dir = os.path.join(base_path, app)
    os.makedirs(app_dir, exist_ok=True)
    
    # __init__.py
    with open(os.path.join(app_dir, '__init__.py'), 'w') as f:
        pass
        
    # apps.py
    with open(os.path.join(app_dir, 'apps.py'), 'w') as f:
        f.write(f"""from django.apps import AppConfig

class {app.capitalize()}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.{app}'
""")

    # admin.py
    with open(os.path.join(app_dir, 'admin.py'), 'w') as f:
        f.write(f"from django.contrib import admin\nfrom . import models\n\n# Register your models here.\n")

    # views.py
    with open(os.path.join(app_dir, 'views.py'), 'w') as f:
        f.write("from django.shortcuts import render\n\n# Create your views here.\n")

    # models.py will be generated in the next step
    
print("Created app directories and base files.")
