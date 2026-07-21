import os

base_dir = r"c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps"
apps = ['hr_attendance', 'hr_holidays', 'hr_recruitment', 'hr_payroll', 'hr_appraisal', 'hr_expense']

for app in apps:
    app_dir = os.path.join(base_dir, app)
    apps_path = os.path.join(app_dir, 'apps.py')
    
    if os.path.exists(apps_path):
        with open(apps_path, 'r') as f:
            content = f.read()
        
        # Replace if incorrect
        if f"name = '{app}'" in content:
            content = content.replace(f"name = '{app}'", f"name = 'apps.{app}'")
            with open(apps_path, 'w') as f:
                f.write(content)
            print(f"Fixed {apps_path}")
