import os

# 1. Fix employees/apps.py
app_file = 'backend/apps/employees/apps.py'
with open(app_file, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("label = 'hr'", "label = 'employees'")
with open(app_file, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. Fix Saless -> Sales globally in sales module
for root, dirs, files in os.walk('backend/apps/sales'):
    for file in files:
        if file.endswith('.py'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                c = f.read()
            if 'Saless' in c or 'saless' in c:
                c = c.replace('Saless', 'Sales').replace('saless', 'sales')
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(c)

# 3. Fix core/infrastructure/signals.py lazy ref
sig_file = 'backend/apps/core/infrastructure/signals.py'
with open(sig_file, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("'sales.saleorder'", "'sales.SalesOrder'")
with open(sig_file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixes applied.")
