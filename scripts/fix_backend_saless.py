import os

BACKEND_DIR = os.path.abspath('backend/apps')

for root, dirs, files in os.walk(BACKEND_DIR):
    for file in files:
        path = os.path.join(root, file)
        
        # Cleanup temp/bak files
        if file.endswith('_bak.py') or file.endswith('.tmp'):
            os.remove(path)
            continue
            
        if file.endswith(('.py', '.md')):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    c = f.read()
                original = c
                
                c = c.replace('Saless', 'Sales')
                c = c.replace('saless', 'sales')

                if c != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(c)
                    print(f"Fixed typo in {file}")
            except Exception as e:
                pass
print("Typo fixes completed.")
