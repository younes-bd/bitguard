import os

MAPPING = {
    'hr_expense': 'expenses', 'hr_payroll': 'payroll', 'hr_holidays': 'timeoff',
    'hr_attendance': 'timeclock', 'hr_recruitment': 'recruiting', 'hr_appraisal': 'performance',
    'hr': 'employees', 'stock': 'inventory', 'mrp': 'manufacturing', 'quality_control': 'quality',
    'sale': 'sales', 'discuss': 'chat', 'mail': 'inbox', 'mass_mailing': 'campaigns',
    'marketing': 'journeys', 'field_service': 'dispatch'
}

BACKEND_DIR = os.path.abspath('backend/apps')

for root, dirs, files in os.walk(BACKEND_DIR):
    if 'migrations' in root:
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        c = f.read()
                    original = c
                    
                    for old, new in MAPPING.items():
                        # Fix migration dependencies
                        c = c.replace(f"('{old}',", f"('{new}',")
                        c = c.replace(f"(\"{old}\",", f"(\"{new}\",")
                        
                        # Also replace in strings like to='sale.SalesOrder'
                        c = c.replace(f"'{old}.", f"'{new}.")
                        c = c.replace(f"\"{old}.", f"\"{new}.")

                    if c != original:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(c)
                        print(f"Fixed migration graph in {file}")
                except Exception as e:
                    print(f"Failed {file}: {e}")

print("Migration graph fixes completed.")
