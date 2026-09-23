import os
import glob

replacements = {
    'accounting': 'Accounting & Finance',
    'consolidation': 'Accounting & Finance',
    'hr_expense': 'Accounting & Finance',
    'invoicing': 'Accounting & Finance',
    'sign': 'Accounting & Finance',
    'barcode': 'Inventory',
    'product': 'Inventory',
    'purchase': 'Inventory',
    'stock': 'Inventory',
    'maintenance': 'Manufacturing',
    'mrp': 'Manufacturing',
    'mrp_plm': 'Manufacturing',
    'quality_control': 'Manufacturing',
    'repair': 'Manufacturing',
    'shop_floor': 'Manufacturing',
}

for app, sec in replacements.items():
    p = f'frontend/src/apps/{app}/config/menu.js'
    if os.path.exists(p):
        with open(p, 'r') as f:
            c = f.read()
        c = c.replace("'Finance'", f"'{sec}'")
        c = c.replace("'Inventory & MRP'", f"'{sec}'")
        with open(p, 'w') as f:
            f.write(c)

print('Done fixing menus.')
