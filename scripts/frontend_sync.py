import os

apps = ['livechat', 'mass_mailing', 'sms', 'whatsapp']

for app in apps:
    menu_path = f"frontend/src/apps/{app}/config/menu.js"
    if os.path.exists(menu_path):
        with open(menu_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We don't really need to parse JS, we can just do simple string replacements if needed.
        # But actually, the backend ManifestView overrides the frontend menu.js for everything EXCEPT the actual icon import and routing.
        # So we just need to ensure they exist.
        print(f"Verified {app} frontend menu exists.")
