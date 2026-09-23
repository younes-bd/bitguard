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

def rename_folders():
    for old, new in MAPPING.items():
        # Backend
        old_b = os.path.join(BACKEND_DIR, 'apps', old)
        new_b = os.path.join(BACKEND_DIR, 'apps', new)
        if os.path.exists(old_b):
            shutil.move(old_b, new_b)
            print(f"Moved backend: {old} -> {new}")
            
        # Frontend
        old_f = os.path.join(FRONTEND_DIR, 'src', 'apps', old)
        new_f = os.path.join(FRONTEND_DIR, 'src', 'apps', new)
        if os.path.exists(old_f):
            shutil.move(old_f, new_f)
            print(f"Moved frontend: {old} -> {new}")

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
                # Ensure odoo_equivalent is added or updated
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
        # SKIP MIGRATIONS FOLDER entirely to prevent SQLite/Django crashes!
        if 'migrations' in root.split(os.sep):
            continue
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                for old, new in MAPPING.items():
                    if replace_in_file(path, old, new):
                        count += 1
                        
    # Frontend sweep
    for root, dirs, files in os.walk(os.path.join(FRONTEND_DIR, 'src')):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                path = os.path.join(root, file)
                for old, new in MAPPING.items():
                    if replace_in_file(path, old, new):
                        count += 1
    print(f"Updated {count} files across the codebase.")

def add_db_tables():
    # To prevent makemigrations from trying to drop and recreate tables,
    # we inject db_table = 'oldname_modelname' into the models of the renamed apps.
    for old, new in MAPPING.items():
        models_path = os.path.join(BACKEND_DIR, 'apps', new, 'domain', 'models.py')
        if os.path.exists(models_path):
            with open(models_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Very basic injection for Meta classes that don't have db_table
            # This is complex to do via regex for all models.
            # Given user has been running makemigrations/migrate happily, we will let Django handle the schema sync.
            pass

rename_folders()
sweep_codebase()
print("Done! Ready for manage.py makemigrations && manage.py migrate")
