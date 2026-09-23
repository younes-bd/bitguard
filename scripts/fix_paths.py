import os

MAPPING = {
    'hr_expense': 'expenses', 'hr_payroll': 'payroll', 'hr_holidays': 'timeoff',
    'hr_attendance': 'timeclock', 'hr_recruitment': 'recruiting', 'hr_appraisal': 'performance',
    'hr': 'employees', 'stock': 'inventory', 'mrp': 'manufacturing', 'quality_control': 'quality',
    'sale': 'sales', 'discuss': 'chat', 'mail': 'inbox', 'email_marketing': 'campaigns',
    'marketing_automation': 'journeys', 'field_service': 'dispatch'
}

FRONTEND_DIR = os.path.abspath('frontend/src')

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    c = f.read()
                original = c
                for old, new in MAPPING.items():
                    # specifically targeting cross-module path imports like ../../mail/
                    c = c.replace(f"/{old}/", f"/{new}/")
                    # also for alias imports like @apps/mail/
                    c = c.replace(f"@{old}/", f"@{new}/")
                if c != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(c)
                    print(f"Fixed cross-module path in {file}")
            except Exception as e:
                continue
print("Path references fixed.")
