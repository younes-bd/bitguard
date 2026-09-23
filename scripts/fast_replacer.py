import os
import re

MAPPING = {
    'purchase': 'procurement',
    'board': 'analytics',
    'reporting': 'reports',
    'delivery': 'shipping',
    'todo': 'tasks',
    'livechat': 'messaging',
    'elearning': 'learning'
}

BACKEND_DIR = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps'
FRONTEND_DIR = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/frontend/src'

def process_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        for old, new in MAPPING.items():
            if 'backend/apps' in path:
                content = content.replace(f"apps.{old}", f"apps.{new}")
                content = content.replace(f"'{old}.", f"'{new}.")
                content = content.replace(f'"{old}.', f'"{new}.')
                content = content.replace(f"'{old}'", f"'{new}'")
                content = content.replace(f'"{old}"', f'"{new}"')
                if path.endswith('__manifest__.py'):
                    content = re.sub(r"(['\"]technical_name['\"]\s*:\s*['\"])(.*?)(['\"])", r"\g<1>" + new + r"\g<3>", content)
                    if 'odoo_equivalent' in content:
                        content = re.sub(r"(['\"]odoo_equivalent['\"]\s*:\s*['\"])(.*?)(['\"])", r"\g<1>" + old + r"\g<3>", content)
                    else:
                        content = re.sub(r"(technical_name.*?\n)", r"\1    'odoo_equivalent': '" + old + "',\n", content)
            
            elif 'frontend/src' in path:
                content = content.replace(f"@/apps/{old}", f"@/apps/{new}")
                content = content.replace(f"/admin/{old}", f"/admin/{new}")
                content = content.replace(f"techName: '{old}'", f"techName: '{new}'")
                content = content.replace(f'techName: "{old}"', f'techName: "{new}"')
                content = content.replace(f"apps/{old}/", f"apps/{new}/")

        if content != original:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception:
        pass
    return False

print("Sweeping backend...")
for root, _, files in os.walk(BACKEND_DIR):
    if 'migrations' in root.split(os.sep) or '__pycache__' in root.split(os.sep):
        continue
    for file in files:
        if file.endswith('.py'):
            process_file(os.path.join(root, file))

print("Sweeping frontend...")
for root, dirs, files in os.walk(FRONTEND_DIR):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
            process_file(os.path.join(root, file))

print("Done string replacements!")
