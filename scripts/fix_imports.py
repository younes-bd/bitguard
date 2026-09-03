import os

renames = {
    '@/apps/recruitment': '@/apps/hr_recruitment',
    '@/apps/sales': '@/apps/sale',
    '@/apps/appraisals': '@/apps/hr_appraisal',
    '@/apps/expenses': '@/apps/hr_expense',
    '@/apps/payroll': '@/apps/hr_payroll',
    '@/apps/support': '@/apps/helpdesk',
    '@/apps/security': '@/apps/soc',
    
    # Also relative imports from outside might exist, e.g. ../../apps/recruitment
    '../apps/recruitment': '../apps/hr_recruitment',
    '../apps/sales': '../apps/sale',
    '../apps/appraisals': '../apps/hr_appraisal',
    '../apps/expenses': '../apps/hr_expense',
    '../apps/payroll': '../apps/hr_payroll',
    '../apps/support': '../apps/helpdesk',
    '../apps/security': '../apps/soc'
}

frontend_dir = 'frontend/src'

for root, dirs, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            modified = False
            for old_str, new_str in renames.items():
                if old_str in content:
                    content = content.replace(old_str, new_str)
                    modified = True
                    
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed imports in {filepath}")
