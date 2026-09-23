import os
import re

BACKEND_DIR = os.path.abspath('backend/apps')

REPLACEMENTS = {
    'stock': 'inventory',
    'sale': 'sales',
    'hr': 'employees',
    'mrp': 'manufacturing',
    'mail': 'inbox',
    'discuss': 'chat',
    'quality_control': 'quality',
    'mass_mailing': 'campaigns',
    'massmailing': 'campaigns',
    'marketing': 'journeys',
    'field_service': 'dispatch'
}

def fix_string(s):
    # s is like "incomingmailserver"
    for old, new in REPLACEMENTS.items():
        if old in s and old != new:
            s = s.replace(old, new)
            
    # For camelcase
    for old, new in REPLACEMENTS.items():
        old_cap = old.capitalize()
        new_cap = new.capitalize()
        if old_cap in s and old_cap != new_cap:
            s = s.replace(old_cap, new_cap)
            
    return s

for root, dirs, files in os.walk(BACKEND_DIR):
    if 'migrations' in root:
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        c = f.read()
                    original = c
                    
                    # 1. model_name='...'
                    def repl_model(m):
                        return f"model_name='{fix_string(m.group(1))}'"
                    c = re.sub(r"model_name='([a-z_]+)'", repl_model, c)
                    
                    # 2. name='...' (for CreateModel)
                    def repl_name(m):
                        return f"name='{fix_string(m.group(1))}'"
                    c = re.sub(r"name='([a-zA-Z_]+)'", repl_name, c)

                    if c != original:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(c)
                        print(f"Deep fixed model names in {file}")
                except Exception as e:
                    pass
print("Deep model name fixes completed.")
