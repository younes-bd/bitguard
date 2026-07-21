import os

base_dir = r"apps"
apps = ['hr_attendance', 'hr_holidays', 'hr_recruitment', 'hr_payroll', 'hr_appraisal', 'hr_expense']

for app in apps:
    app_dir = os.path.join(base_dir, app)
    os.makedirs(app_dir, exist_ok=True)
    
    # __init__.py
    with open(os.path.join(app_dir, '__init__.py'), 'w') as f:
        pass
        
    # apps.py
    with open(os.path.join(app_dir, 'apps.py'), 'w') as f:
        f.write(f'''from django.apps import AppConfig

class {app.replace('_', ' ').title().replace(' ', '')}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.{app}'
''')
    print(f"Created apps.py and __init__.py for {app}")
