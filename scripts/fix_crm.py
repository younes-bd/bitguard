import os
import re

def fix_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    # Replace anything matching CrmSales*Team with CrmSalesTeam
    c = re.sub(r"CrmSales+Team", "CrmSalesTeam", c)
    c = re.sub(r"crmsales+team", "crmsalesteam", c)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

fix_file('backend/apps/crm/migrations/0001_initial.py', '', '')
fix_file('backend/apps/crm/migrations/0002_initial.py', '', '')

print("CRM fixed.")
