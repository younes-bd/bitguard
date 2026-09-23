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
                        content = f.read()
                    
                    matches = re.findall(r"model_name='([a-z_]+)'", content)
                    for m in matches:
                        for old in ['stock', 'sale', 'hr', 'mrp', 'mail', 'discuss', 'quality', 'marketing', 'mass_mailing']:
                            if old in m:
                                print(f"{path}: model_name='{m}'")
                except Exception as e:
                    pass
