import os
import re

frontend_src = "/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/frontend/src"

replacements = [
    # Specific sub-routes
    (r'/admin/erp/invoices', r'/admin/accounting/invoices'),
    (r'/admin/erp/quotations', r'/admin/sales/quotations'),
    (r'/admin/erp/receipts', r'/admin/accounting/receipts'),
    (r'/admin/erp/delivery', r'/admin/inventory/deliveries'),
    (r'/admin/erp/purchase-orders', r'/admin/purchase/orders'),
    (r'/admin/erp/credit-notes', r'/admin/accounting/credit-notes'),
    (r'/admin/erp/payroll/runs', r'/admin/hrm/payroll'),
    (r'/admin/erp/projects', r'/admin/projects/list'),
    (r'/admin/erp/vendors', r'/admin/purchase/vendors'),
    
    # Base fallback
    (r'/admin/erp', r'/admin/accounting'), # ERP base usually went to finance/accounting
]

files_updated = 0

for root, dirs, files in os.walk(frontend_src):
    for file in files:
        if file.endswith(('.jsx', '.js', '.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements:
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                files_updated += 1
                print(f"Updated: {path}")

print(f"Updated {files_updated} files.")
