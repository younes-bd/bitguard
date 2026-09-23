import os
MAPPING = {
    'hr_expense': 'expenses', 'hr_payroll': 'payroll', 'hr_holidays': 'timeoff',
    'hr_attendance': 'timeclock', 'hr_recruitment': 'recruiting', 'hr_appraisal': 'performance',
    'hr': 'employees', 'stock': 'inventory', 'mrp': 'manufacturing', 'quality_control': 'quality',
    'sale': 'sales', 'discuss': 'chat', 'mail': 'inbox', 'email_marketing': 'campaigns',
    'marketing_automation': 'journeys', 'field_service': 'dispatch'
}
FRONTEND_DIR = os.path.abspath('frontend/src/apps')

for root, dirs, files in os.walk(FRONTEND_DIR, topdown=False):
    for file in files:
        new_file = file
        for old, new in MAPPING.items():
            if old in new_file and old != new:
                # e.g., hrService.js -> employeesService.js
                new_file = new_file.replace(old, new)
            elif old.capitalize() in new_file and old != new:
                new_file = new_file.replace(old.capitalize(), new.capitalize())

        if 'Saless' in new_file: new_file = new_file.replace('Saless', 'Sales')
        if 'saless' in new_file: new_file = new_file.replace('saless', 'sales')
        
        if new_file != file:
            os.rename(os.path.join(root, file), os.path.join(root, new_file))
            print(f"Renamed {file} -> {new_file}")

# Fix contents
for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f: c = f.read()
            original = c
            c = c.replace('Saless', 'Sales').replace('saless', 'sales')
            for old, new in MAPPING.items():
                c = c.replace(f"{old}Service", f"{new}Service")
                c = c.replace(f"{old}AdminRoutes", f"{new}AdminRoutes")
                c = c.replace(f"{old}Store", f"{new}Store")
            if c != original:
                with open(path, 'w', encoding='utf-8') as f: f.write(c)
                print(f"Fixed content in {file}")
print("Frontend cleanup done.")
