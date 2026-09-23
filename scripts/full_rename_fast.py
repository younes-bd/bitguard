import os
import shutil
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

BACKEND_DIR = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend'
FRONTEND_DIR = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/frontend'

def replace_in_file(path, old, new):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original = content
        
        if 'backend/apps' in path:
            # Backend specific replacements
            content = content.replace(f"apps.{old}", f"apps.{new}")
            content = content.replace(f"'{old}.", f"'{new}.")
            content = content.replace(f'"{old}.', f'"{new}.')
            content = content.replace(f"'{old}'", f"'{new}'")
            content = content.replace(f'"{old}"', f'"{new}"')
            
            # Manifest updates
            if path.endswith('__manifest__.py'):
                content = re.sub(r"(['\"]technical_name['\"]\s*:\s*['\"])(.*?)(['\"])", r"\g<1>" + new + r"\g<3>", content)
                if 'odoo_equivalent' in content:
                    content = re.sub(r"(['\"]odoo_equivalent['\"]\s*:\s*['\"])(.*?)(['\"])", r"\g<1>" + old + r"\g<3>", content)
                else:
                    content = re.sub(r"(technical_name.*?\n)", r"\1    'odoo_equivalent': '" + old + "',\n", content)
                    
        elif 'frontend/src' in path:
            # Frontend specific replacements
            content = content.replace(f"@/apps/{old}", f"@/apps/{new}")
            content = content.replace(f"/admin/{old}", f"/admin/{new}")
            content = content.replace(f"techName: '{old}'", f"techName: '{new}'")
            content = content.replace(f'techName: "{old}"', f'techName: "{new}"')
            content = content.replace(f"apps/{old}/", f"apps/{new}/")

        if content != original:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        pass
    return False

def sweep_codebase():
    count = 0
    # Backend sweep
    for root, dirs, files in os.walk(os.path.join(BACKEND_DIR, 'apps')):
        # Modify dirs in place to prevent traversing __pycache__ and migrations
        dirs[:] = [d for d in dirs if d not in ('migrations', '__pycache__')]
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                for old, new in MAPPING.items():
                    if replace_in_file(path, old, new):
                        count += 1
                        
    # Frontend sweep
    for root, dirs, files in os.walk(os.path.join(FRONTEND_DIR, 'src')):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                path = os.path.join(root, file)
                for old, new in MAPPING.items():
                    if replace_in_file(path, old, new):
                        count += 1
    print(f"Updated {count} files across the codebase.")

sweep_codebase()
print("String replacements complete!")
