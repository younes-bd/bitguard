import os
import re

frontend_dir = "frontend/src"

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = content
    # Update ErpDashboard references -> AccountingDashboard
    new_content = new_content.replace('ErpDashboard', 'AccountingDashboard')
    new_content = new_content.replace('ErpReportPage', 'AccountingReportPage')
    new_content = new_content.replace('ErpSettings', 'SysadminSettings')
    
    # Update generic imports
    new_content = new_content.replace("from 'apps/erp/pages/dashboards/ErpDashboard'", "from 'apps/accounting/pages/dashboards/AccountingDashboard'")
    new_content = new_content.replace("from 'apps/erp/pages/dashboards/ErpReportPage'", "from 'apps/accounting/pages/AccountingReportPage'")
    
    # Replace other apps/erp paths broadly
    new_content = re.sub(r"'apps/erp/pages/accounting/([^']+)'", r"'apps/accounting/pages/accounting/\1'", new_content)
    new_content = re.sub(r"'apps/erp/pages/billing/([^']+)'", r"'apps/billing/pages/billing/\1'", new_content)
    new_content = re.sub(r"'apps/erp/pages/vendors/([^']+)'", r"'apps/purchase/pages/vendors/\1'", new_content)
    new_content = re.sub(r"'apps/erp/pages/([^']+)'", r"'apps/accounting/pages/\1'", new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            replace_in_file(os.path.join(root, file))

print("Done updating frontend erp paths.")
