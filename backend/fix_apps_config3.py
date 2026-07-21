import os

base_dir = r"apps"
apps = ['hr_attendance', 'hr_holidays', 'hr_recruitment', 'hr_payroll', 'hr_appraisal', 'hr_expense']

for app in apps:
    app_dir = os.path.join(base_dir, app)
    apps_path = os.path.join(app_dir, 'apps.py')
    
    if os.path.exists(apps_path):
        with open(apps_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Unconditionally rewrite the file to be completely safe
        new_content = f"""from django.apps import AppConfig

class {app.replace('_', ' ').title().replace(' ', '')}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.{app}'
"""
        with open(apps_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Rewrote {apps_path}")
