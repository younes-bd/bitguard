import os
import glob
import django
from django.conf import settings

BASE_DIR = "."
apps_dir = os.path.join(BASE_DIR, "apps")
integrations_dir = os.path.join(BASE_DIR, "integrations")

# Clean up stray migrations (those that aren't __init__.py)
for folder in [apps_dir, integrations_dir]:
    for app in os.listdir(folder):
        app_path = os.path.join(folder, app)
        if os.path.isdir(app_path):
            mig_dir = os.path.join(app_path, "migrations")
            if os.path.isdir(mig_dir):
                for mig_file in os.listdir(mig_dir):
                    if mig_file.endswith(".py") and mig_file != "__init__.py":
                        os.remove(os.path.join(mig_dir, mig_file))

# Add missing admin.py and auto-register models
def scaffold_admin(app_path, app_name):
    models_file = os.path.join(app_path, "models.py")
    if not os.path.exists(models_file):
        return
        
    # very naive model extraction
    with open(models_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    models = []
    for line in content.split("\n"):
        if line.startswith("class ") and "(models.Model)" in line or "(BaseModel)" in line or "(TenantAwareModel)" in line:
            model_name = line.split("class ")[1].split("(")[0].strip()
            models.append(model_name)
            
    if models:
        admin_file = os.path.join(app_path, "admin.py")
        with open(admin_file, "w", encoding="utf-8") as f:
            f.write("from django.contrib import admin\n")
            f.write(f"from .domain.models import {', '.join(models)}\n\n")
            for m in models:
                f.write(f"admin.site.register({m})\n")

for folder in [apps_dir, integrations_dir]:
    for app in os.listdir(folder):
        app_path = os.path.join(folder, app)
        if os.path.isdir(app_path):
            scaffold_admin(app_path, app)

print("Cleanup and admin scaffolding complete!")
