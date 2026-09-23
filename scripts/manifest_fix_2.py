import os
MAPPING = {
    'hr': 'employees', 'stock': 'inventory', 'mrp': 'manufacturing', 'quality_control': 'quality',
    'sale': 'sales', 'discuss': 'chat', 'mail': 'inbox', 'email_marketing': 'campaigns',
    'marketing_automation': 'journeys', 'field_service': 'dispatch'
}
BACKEND_DIR = os.path.abspath('backend/apps')
for root, dirs, files in os.walk(BACKEND_DIR):
    for file in files:
        if file == '__manifest__.py':
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f: content = f.read()
            for old, new in MAPPING.items():
                content = content.replace(f"'{old}'", f"'{new}'")
            with open(path, 'w', encoding='utf-8') as f: f.write(content)
