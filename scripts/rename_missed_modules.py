import os
import sqlite3

BASE_DIR = os.path.abspath('.')
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

MAPPING = {
    'mass_mailing': 'campaigns',
    'mass_inboxing': 'campaigns', # from the earlier mangling
    'marketing': 'journeys',
}

# 1. Database Table Rename
db_path = os.path.expanduser('~/website13_db.sqlite3')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute("UPDATE core_installedmodule SET technical_name='campaigns' WHERE technical_name IN ('mass_mailing', 'mass_inboxing')")
    cur.execute("UPDATE core_installedmodule SET technical_name='journeys' WHERE technical_name='marketing'")
    
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in cur.fetchall()]
    
    for table in tables:
        for old, new in MAPPING.items():
            if table.startswith(f"{old}_"):
                new_table = table.replace(old, new, 1)
                cur.execute(f"ALTER TABLE {table} RENAME TO {new_table}")
                print(f"DB Rename: {table} -> {new_table}")
    
    # Check for core_commandcentersection
    cur.execute("UPDATE core_commandcentersection SET name='Marketing' WHERE name='Marketing'") # No change needed for the pillar name
    conn.commit()
    conn.close()

# 2. Rename Folders
for old, new in [('mass_mailing', 'campaigns'), ('marketing', 'journeys')]:
    b_old = os.path.join(BACKEND_DIR, 'apps', old)
    b_new = os.path.join(BACKEND_DIR, 'apps', new)
    if os.path.exists(b_old): os.rename(b_old, b_new)
    
    f_old = os.path.join(FRONTEND_DIR, 'src', 'apps', old)
    f_new = os.path.join(FRONTEND_DIR, 'src', 'apps', new)
    if os.path.exists(f_old): os.rename(f_old, f_new)

# 3. Rename Frontend Files
def pascal_case(s):
    return ''.join(word.capitalize() for word in s.split('_'))

for root, dirs, files in os.walk(FRONTEND_DIR, topdown=False):
    for file in files:
        new_file = file
        for old, new in MAPPING.items():
            if old in new_file and old != new:
                new_file = new_file.replace(old, new)
            elif pascal_case(old) in new_file:
                new_file = new_file.replace(pascal_case(old), pascal_case(new))
            elif old.capitalize() in new_file:
                new_file = new_file.replace(old.capitalize(), new.capitalize())
        if new_file != file:
            try:
                os.rename(os.path.join(root, file), os.path.join(root, new_file))
            except Exception:
                pass

# 4. Text Replacements
def process_file(filepath):
    if not os.path.isfile(filepath): return
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return

    original = content
    
    for old, new in MAPPING.items():
        # strict matches to avoid matching sms_marketing
        strict_matches = [
            f"'{old}'", f"\"{old}\"",
            f"'{old}.", f"\"{old}.",
            f"apps.{old}", f"/{old}/", f"@{old}/",
            f"name = '{old}'", f"app_label = '{old}'",
            f"name = \"{old}\"", f"app_label = \"{old}\"",
            f"register('{old}/"
        ]
        for match in strict_matches:
            new_match = match.replace(old, new)
            content = content.replace(match, new_match)
        
        # Manifest
        if filepath.endswith('__manifest__.py'):
            content = content.replace(f"'{old}'", f"'{new}',\n    'odoo_equivalent': '{old}'")
            content = content.replace(f"'/admin/{old}'", f"'/admin/{new}'")
            
        # Pascal and Camel replacements
        old_p = pascal_case(old)
        new_p = pascal_case(new)
        content = content.replace(f"{old}Service", f"{new}Service")
        content = content.replace(f"{old}Store", f"{new}Store")
        content = content.replace(f"{old}AdminRoutes", f"{new}AdminRoutes")
        if old_p != new_p:
            content = content.replace(old_p, new_p)
            
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for d in [BACKEND_DIR, FRONTEND_DIR, os.path.join(BASE_DIR, '.agents')]:
    for root, dirs, files in os.walk(d):
        if 'venv' in root or 'node_modules' in root or '.git' in root or '__pycache__' in root:
            continue
        for file in files:
            if file.endswith(('.py', '.js', '.jsx', '.md')):
                process_file(os.path.join(root, file))

print("Script execution completed.")
