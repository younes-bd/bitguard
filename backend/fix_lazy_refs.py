import os

files_to_update = [
    "apps/core/infrastructure/signals.py",
    "apps/purchase/domain/models.py",
    "apps/purchase/migrations/0002_initial.py",
    "apps/stock/migrations/0002_initial.py",
    "apps/stock/migrations/0003_stocklot_storagelocation_stockpicking.py"
]

for file_path in files_to_update:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace("'inventory.", "'stock.")
        # also handle case with double quotes just in case
        content = content.replace('"inventory.', '"stock.')
        
        # In migrations, there is `dependencies = [ ('inventory', '...'), ]`
        content = content.replace("('inventory'", "('stock'")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"File not found: {file_path}")
