import os
import re

base_dir = r"apps"

files_to_update = [
    "accounting/application/services.py",
    "core/management/commands/seed_enterprise_data.py",
    "mrp/api/views.py",
    "purchase/api/views.py",
    "sale/api/views.py",
    "ecommerce/application/services.py",
]

for rel_path in files_to_update:
    file_path = os.path.join(base_dir, rel_path)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = re.sub(r'from\s+apps\.inventory\.domain\.models\s+import\s+DeliveryNote', 'from apps.delivery.domain.models import DeliveryNote', content)
        content = content.replace('apps.inventory', 'apps.stock')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {rel_path}")
    else:
        print(f"File not found: {file_path}")
