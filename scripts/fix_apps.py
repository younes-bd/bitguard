import os

MAPPING = {
    'purchase': 'procurement',
    'board': 'analytics',
    'reporting': 'reports',
    'delivery': 'shipping',
    'todo': 'tasks',
    'livechat': 'messaging',
    'elearning': 'learning'
}

for old, new in MAPPING.items():
    apps_py = f'/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps/{new}/apps.py'
    if os.path.exists(apps_py):
        with open(apps_py, 'r') as f:
            content = f.read()
        content = content.replace(f"name = 'apps.{old}'", f"name = 'apps.{new}'")
        content = content.replace(f'name = "apps.{old}"', f"name = 'apps.{new}'")
        # Let's also fix the import inside ready and _register_api_routes
        content = content.replace(f"apps.{old}", f"apps.{new}")
        content = content.replace(f"'{old}/'", f"'{new}/'")
        
        with open(apps_py, 'w') as f:
            f.write(content)
