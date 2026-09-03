import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD_FILE = os.path.join(ROOT_DIR, 'odoo_architecture_sequence.md')
APPS_DIR = os.path.join(ROOT_DIR, 'backend', 'apps')

with open(MD_FILE, 'r') as f:
    lines = f.readlines()

current_section = None
section_sequence = 0
app_sequence = 0
in_shared = False
in_external = False
in_kernel = False

updates = {}

for line in lines:
    line = line.strip()
    
    # Catch Sections
    sec_match = re.match(r'^## \d+\.\s+(.*?)\s+\(Sequence:\s+(\d+)\)', line)
    if sec_match:
        current_section = sec_match.group(1)
        section_sequence = int(sec_match.group(2))
        app_sequence = 1
        continue
        
    if '### Shared Utilities & Master Data' in line:
        current_section = None
        in_shared = True
        continue
        
    if '### External Integrations & API Bridges' in line:
        current_section = None
        in_shared = False
        in_external = True
        continue
        
    if '### Hidden / Technical Kernel' in line:
        current_section = None
        in_external = False
        in_kernel = True
        continue

    # Catch Apps
    # e.g. 1. **Sales** (sale_management) - Core quoting and sales orders.
    # e.g. * **Portal** (portal) - Powers the external customer...
    app_match = re.match(r'^(?:\d+\.|\*)\s+\*\*(.*?)\*\*\s+\(([^]+)(?:\s*/\s*[^]+)*\)\s+-\s+(.*)', line)
    if app_match:
        name = app_match.group(1)
        tech_name_full = app_match.group(2)
        desc = app_match.group(3)
        
        # Some have multiple like (ccount_accountant / ccounting), take the first, but we actually use the names of our folders.
        # Let's map Odoo tech names to our folder names if they differ, or just use our folder names if they exist.
        
        # We will iterate through all apps in the backend to find which one matches.
        tech_name = tech_name_full
        
        # Custom mappings from odoo names to our names based on what we have in the backend
        mappings = {
            'sale_management': 'sale',
            'point_of_sale': 'pos',
            'sale_subscription': 'subscriptions',
            'sale_renting': 'rental',
            'sale_amazon': 'amazon',
            'industry_fsm': 'field_service',
            'account_accountant': 'accounting',
            'account': 'invoicing',
            'account_consolidation': 'consolidation',
            'spreadsheet_dashboard': 'spreadsheet',
            'stock_barcode': 'barcode',
            'mrp_workorder_ui': 'shop_floor',
            'quality_control': 'quality',
            'website_sale': 'ecommerce',
            'website_slides': 'elearning',
            'website_forum': 'forum',
            'website_blog': 'blog',
            'im_livechat': 'livechat',
            'mass_mailing': 'mass_mailing',
            'mass_mailing_sms': 'sms',
            'project_todo': 'todo',
            'base_report_designer': 'reporting',
            'mail_bot': 'notifications',
        }
        
        our_tech_name = mappings.get(tech_name, tech_name)
        
        app_data = {
            'name': name,
            'summary': desc,
        }
        
        if current_section:
            app_data['command_center_section'] = current_section
            app_data['sequence'] = app_sequence
            app_data['application'] = True
            app_sequence += 1
        elif in_shared or in_external:
            app_data['application'] = False
            app_data['sequence'] = 99
        elif in_kernel:
            app_data['application'] = False
            app_data['sequence'] = 999
            
        updates[our_tech_name] = app_data


import ast

def update_manifest(filepath, new_data):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    try:
        manifest = ast.literal_eval(content)
    except Exception as e:
        print(f'Error parsing {filepath}: {e}')
        return
        
    changed = False
    
    # Force alignment
    if 'name' in new_data and manifest.get('name') != new_data['name']:
        manifest['name'] = new_data['name']
        changed = True
        
    if 'summary' in new_data and manifest.get('summary') != new_data['summary']:
        manifest['summary'] = new_data['summary']
        changed = True
        
    if 'command_center_section' in new_data:
        if manifest.get('command_center_section') != new_data['command_center_section']:
            manifest['command_center_section'] = new_data['command_center_section']
            changed = True
    else:
        if 'command_center_section' in manifest:
            del manifest['command_center_section']
            changed = True
            
    if 'sequence' in new_data and manifest.get('sequence') != new_data['sequence']:
        manifest['sequence'] = new_data['sequence']
        changed = True
        
    if 'application' in new_data and manifest.get('application') != new_data['application']:
        manifest['application'] = new_data['application']
        changed = True

    if changed:
        import pprint
        new_content = pprint.pformat(manifest, sort_dicts=False, width=120)
        # Formatting fixes
        new_content = new_content.replace(" \n ,
