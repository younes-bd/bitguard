import os

FRONTEND_DIR = os.path.abspath('frontend/src/apps')

for root, dirs, files in os.walk(FRONTEND_DIR, topdown=False):
    for file in files:
        new_file = file
        if 'Saless' in new_file: new_file = new_file.replace('Saless', 'Sales')
        if 'saless' in new_file: new_file = new_file.replace('saless', 'sales')
        
        if new_file != file:
            try:
                os.rename(os.path.join(root, file), os.path.join(root, new_file))
                print(f"Renamed {file} -> {new_file}")
            except Exception as e:
                print(f"Failed to rename {file}: {e}")

# Fix contents
for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f: c = f.read()
                original = c
                c = c.replace('Saless', 'Sales').replace('saless', 'sales')
                if c != original:
                    with open(path, 'w', encoding='utf-8') as f: f.write(c)
                    print(f"Fixed content in {file}")
            except Exception as e:
                continue

print("Frontend cleanup done.")
