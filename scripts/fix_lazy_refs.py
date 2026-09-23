import os
import re

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
                    
                    c = c.replace("to='sales.saleorder'", "to='sales.salesorder'")
                    c = c.replace("to='sales.SaleOrder'", "to='sales.SalesOrder'")
                    
                    c = c.replace("to='sales.saleorderline'", "to='sales.salesorderline'")
                    c = c.replace("to='sales.SaleOrderLine'", "to='sales.SalesOrderLine'")
                    
                    c = c.replace("to='crm.crmsalesteam'", "to='crm.crmsalesteam'")
                    
                    c = c.replace("to='inventory.stock", "to='inventory.inventory")
                    c = c.replace("to='inventory.Stock", "to='inventory.Inventory")
                    
                    c = c.replace("to='journeys.massmailing'", "to='journeys.campaigns'")
                    c = c.replace("to='journeys.MassMailing'", "to='journeys.Campaigns'")

                    if c != original:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(c)
                        print(f"Fixed lazy references in {file}")
                except Exception as e:
                    pass
print("Lazy reference fixes completed.")
