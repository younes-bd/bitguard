import os
import ast
import pprint

ROOT = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps'

def update_manifest(app_name, new_section):
    path = os.path.join(ROOT, app_name, '__manifest__.py')
    with open(path, 'r', encoding='utf-8') as f:
        m = ast.literal_eval(f.read())
    
    m['command_center_section'] = new_section
    
    new_content = pprint.pformat(m, sort_dicts=False, width=120).replace(" \n ,
