import os
import re

MAPPING = {
    'hr_expense': 'expenses',
    'hr_payroll': 'payroll',
    'hr_holidays': 'timeoff',
    'hr_attendance': 'timeclock',
    'hr_recruitment': 'recruiting',
    'hr_appraisal': 'performance',
    'hr': 'employees',
    'stock': 'inventory',
    'mrp': 'manufacturing',
    'quality_control': 'quality',
    'sale': 'sales',
    'discuss': 'chat',
    'mail': 'inbox',
    'email_marketing': 'campaigns',
    'marketing_automation': 'journeys',
    'field_service': 'dispatch'
}

def pascal_case(s):
    return ''.join(word.capitalize() for word in s.split('_'))

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

# 1. Rename Directories
for old, new in MAPPING.items():
    b_old = os.path.join(BACKEND_DIR, 'apps', old)
    b_new = os.path.join(BACKEND_DIR, 'apps', new)
    if os.path.exists(b_old):
        os.rename(b_old, b_new)
        print(f"Renamed backend dir: {old} -> {new}")
        
    f_old = os.path.join(FRONTEND_DIR, 'src', 'apps', old)
    f_new = os.path.join(FRONTEND_DIR, 'src', 'apps', new)
    if os.path.exists(f_old):
        os.rename(f_old, f_new)
        print(f"Renamed frontend dir: {old} -> {new}")

# 2. Process Files
def process_file(filepath):
    if not os.path.isfile(filepath): return
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return

    original = content
    
    for old, new in MAPPING.items():
        # Backend imports and namespaces
        content = content.replace(f"apps.{old}.", f"apps.{new}.")
        content = content.replace(f"apps.{old}'", f"apps.{new}'")
        content = content.replace(f"apps.{old}\"", f"apps.{new}\"")
        content = content.replace(f"name = 'apps.{old}'", f"name = 'apps.{new}'")
        content = content.replace(f"app_label = '{old}'", f"app_label = '{new}'")
        content = content.replace(f"app_label = \"{old}\"", f"app_label = \"{new}\"")
        content = content.replace(f"register('{old}/", f"register('{new}/")
        
        # Manifest injections
        if filepath.endswith('__manifest__.py'):
            content = content.replace(f"'technical_name': '{old}'", f"'technical_name': '{new}',\n    'odoo_equivalent': '{old}'")
            content = content.replace(f"'/admin/{old}'", f"'/admin/{new}'")
        
        # Frontend Paths & Endpoints
        content = content.replace(f"apps/{old}/", f"apps/{new}/")
        content = content.replace(f"api/v1/{old}/", f"api/v1/{new}/")
        content = content.replace(f"apiClient.get('{old}/", f"apiClient.get('{new}/")
        content = content.replace(f"apiClient.post('{old}/", f"apiClient.post('{new}/")
        content = content.replace(f"apiClient.put('{old}/", f"apiClient.put('{new}/")
        content = content.replace(f"apiClient.patch('{old}/", f"apiClient.patch('{new}/")
        content = content.replace(f"apiClient.delete('{old}/", f"apiClient.delete('{new}/")
        
        # Component & Class Renames
        old_p = pascal_case(old)
        new_p = pascal_case(new)
        if old_p != new_p:
            content = content.replace(old_p, new_p)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# Walk directories
for root, dirs, files in os.walk(BACKEND_DIR):
    if 'venv' in root or '__pycache__' in root: continue
    for file in files:
        if file.endswith('.py'):
            process_file(os.path.join(root, file))

for root, dirs, files in os.walk(FRONTEND_DIR):
    if 'node_modules' in root or '.git' in root or 'dist' in root: continue
    for file in files:
        if file.endswith(('.js', '.jsx')):
            process_file(os.path.join(root, file))

# 3. Rename Component Files
for root, dirs, files in os.walk(FRONTEND_DIR, topdown=False):
    if 'node_modules' in root or '.git' in root or 'dist' in root: continue
    for file in files:
        for old, new in MAPPING.items():
            old_p = pascal_case(old)
            new_p = pascal_case(new)
            if old_p in file and old_p != new_p:
                new_file = file.replace(old_p, new_p)
                os.rename(os.path.join(root, file), os.path.join(root, new_file))
                break 

print("File system refactoring completed!")
