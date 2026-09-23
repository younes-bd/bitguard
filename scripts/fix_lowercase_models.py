import os

BACKEND_DIR = os.path.abspath('backend/apps')

MAPPING = {
    'stockadjustment': 'inventoryadjustment',
    'stocklot': 'inventorylot',
    'stockmove': 'inventorymove',
    'stockpicking': 'inventorypicking',
    'saleorder': 'salesorder',
    'saleorderline': 'salesorderline',
    'salesteam': 'salesteam', # Wait, SalesTeam is in `sales` app? 'sales' app already has 'salesteam' ? Wait, 'sale' became 'sales', so model is 'SalesTeam', which is 'salesteam'. But it was 'salesteam' in Odoo, so it stays 'salesteam'.
    'massmailing': 'campaigns', # wait, Campaigns isn't 'campaigns', it's 'campaign'.
    'marketingworkflow': 'journeysworkflow'
}

for root, dirs, files in os.walk(BACKEND_DIR):
    if 'migrations' in root:
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        c = f.read()
                    original = c
                    
                    c = c.replace("model_name='stockadjustment'", "model_name='inventoryadjustment'")
                    c = c.replace("model_name='stocklot'", "model_name='inventorylot'")
                    c = c.replace("model_name='stockmove'", "model_name='inventorymove'")
                    c = c.replace("model_name='stockpicking'", "model_name='inventorypicking'")
                    c = c.replace("model_name='saleorder'", "model_name='salesorder'")
                    c = c.replace("model_name='saleorderline'", "model_name='salesorderline'")
                    
                    # Also replace in the `name=` of CreateModel just in case
                    c = c.replace("name='stockadjustment'", "name='inventoryadjustment'")
                    c = c.replace("name='stocklot'", "name='inventorylot'")
                    c = c.replace("name='stockmove'", "name='inventorymove'")
                    c = c.replace("name='stockpicking'", "name='inventorypicking'")
                    c = c.replace("name='saleorder'", "name='salesorder'")
                    c = c.replace("name='saleorderline'", "name='salesorderline'")

                    if c != original:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(c)
                        print(f"Fixed lowercase models in {file}")
                except Exception as e:
                    pass
print("Model name fixes completed.")
