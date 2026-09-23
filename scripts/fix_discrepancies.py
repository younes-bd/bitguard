import os
import re

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

# 1. Accounting
f = 'backend/apps/accounting/migrations/0002_initial.py'
replace_in_file(f, "name='sales_order'", "name='sale_order'")
replace_in_file(f, "('sales', 'Sales')", "('sale', 'Sales')")
replace_in_file(f, "('sales', 'Sales Tax')", "('sale', 'Sales Tax')")

# 2. Chat
f = 'backend/apps/chat/migrations/0002_initial.py'
replace_in_file(f, "related_name='chat_channels'", "related_name='discuss_channels'")
replace_in_file(f, "related_name='chat_messages'", "related_name='discuss_messages'")

# 3. Journeys
f = 'backend/apps/journeys/migrations/0002_initial.py'
replace_in_file(f, "related_name='journeys_campaigns'", "related_name='marketing_campaigns'")
replace_in_file(f, "related_name='journeys_interactions'", "related_name='marketing_interactions'")
replace_in_file(f, "related_name='journeys_workflows'", "related_name='marketing_workflows'")

# 4. Sales
f = 'backend/apps/sales/migrations/0002_initial.py'
replace_in_file(f, "related_name='sales_orders'", "related_name='sale_orders'")
replace_in_file(f, "('sales', 'Sales Order')", "('sale', 'Sales Order')")

# 5. SOC (ThreatIntelligence)
f = 'backend/apps/soc/migrations/0001_initial.py'
replace_in_file(f, "name='TemployeeseatIntelligence'", "name='ThreatIntelligence'")
f = 'backend/apps/soc/migrations/0002_initial.py'
replace_in_file(f, "model_name='temployeeseatintelligence'", "model_name='threatintelligence'")
replace_in_file(f, "model_name='TemployeeseatIntelligence'", "model_name='ThreatIntelligence'")

# Delete 0003 migrations
for root, dirs, files in os.walk('backend/apps'):
    if 'migrations' in root:
        for file in files:
            if file.startswith('0003_') and file.endswith('.py'):
                os.remove(os.path.join(root, file))

print("Fixed discrepancies and deleted 0003 migrations.")
