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
                    
                    c = re.sub(r'saless+', 'sales', c)
                    c = re.sub(r'Saless+', 'Sales', c)

                    if c != original:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(c)
                        print(f"Fixed multiple S in {file}")
                except Exception as e:
                    pass
print("Multiple S fixes completed.")
