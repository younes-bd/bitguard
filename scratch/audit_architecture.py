import os, re, json
ROOT_DIR = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13'
MD_FILE = os.path.join(ROOT_DIR, 'odoo_architecture_sequence.md')
APPS_DIR = os.path.join(ROOT_DIR, 'backend', 'apps')

# 1. Parse markdown
md_apps = {}
with open(MD_FILE, 'r') as f:
    lines = f.readlines()

current_section = None
for line in lines:
    line = line.strip()
    sec_match = re.match(r'^## \d+\.\s+(.*?)\s+\(Sequence:\s+(\d+)\)', line)
    if sec_match:
        current_section = sec_match.group(1)
        continue
    if '### Shared Utilities & Master Data' in line:
        current_section = 'Shared Utilities & Master Data'
        continue
    if '### External Integrations & API Bridges' in line:
        current_section = 'External Integrations & API Bridges'
        continue
    if '### Hidden / Technical Kernel' in line:
        current_section = 'Hidden / Technical Kernel'
        continue

    app_match = re.match(r'^(?:\d+\.|\*)\s+\*\*(.*?)\*\*\s+\(([^]+)(?:\s*/\s*[^]+)*\)\s+-\s+(.*)', line)
    if app_match:
        name = app_match.group(1)
        tech_name = app_match.group(2)
        md_apps[tech_name] = {'name': name, 'section': current_section}

# 2. Parse physical apps
physical_apps = {}
import ast
for app_name in os.listdir(APPS_DIR):
    if app_name == '__pycache__': continue
    manifest_path = os.path.join(APPS_DIR, app_name, '__manifest__.py')
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, 'r', encoding='utf-8') as f:
                content = ast.literal_eval(f.read())
            physical_apps[app_name] = content
        except Exception:
            physical_apps[app_name] = {'error': 'Failed to parse manifest'}

# 3. Compare
output = {'missing_folders': [], 'unmapped_folders': [], 'miscategorized': []}

# Find what is in markdown but not in physical
# Note: we need to handle mappings again
mappings = {
    'sale_management': 'sale', 'point_of_sale': 'pos', 'sale_subscription': 'subscriptions',
    'sale_renting': 'rental', 'sale_amazon': 'amazon', 'industry_fsm': 'field_service',
    'account_accountant': 'accounting', 'account': 'invoicing', 'account_consolidation': 'consolidation',
    'spreadsheet_dashboard': 'spreadsheet', 'stock_barcode': 'barcode', 'mrp_workorder_ui': 'shop_floor',
    'quality_control': 'quality_control', 'website_sale': 'ecommerce', 'website_slides': 'elearning',
    'website_forum': 'forum', 'website_blog': 'blog', 'im_livechat': 'livechat',
    'mass_mailing': 'mass_mailing', 'mass_mailing_sms': 'sms', 'project_todo': 'todo',
    'base_report_designer': 'reporting', 'mail_bot': 'notifications', 'web_studio': 'studio',
    'hr_timesheet': 'timesheets', 'survey': 'surveys', 'project': 'projects', 'hr_referral': 'referrals',
    'marketing_automation': 'marketing', 'event': 'events', 'mail': 'discuss', 'appointment': 'appointments'
}
reverse_mappings = {v: k for k, v in mappings.items()}

for md_tech, md_data in md_apps.items():
    phys_tech = mappings.get(md_tech, md_tech)
    if phys_tech not in physical_apps:
        output['missing_folders'].append({'md_tech': md_tech, 'phys_tech_expected': phys_tech, 'name': md_data['name']})
    else:
        # Check categorization
        phys_data = physical_apps[phys_tech]
        phys_section = phys_data.get('command_center_section', 'N/A')
        
        # Translate MD section logic
        expected_section = md_data['section']
        if expected_section in ['Shared Utilities & Master Data', 'External Integrations & API Bridges', 'Hidden / Technical Kernel']:
            # In these, physical shouldn't have a command center section usually, or it doesn't matter as much, but let's check application=False
            if phys_data.get('application', True) != False:
                output['miscategorized'].append({
                    'app': phys_tech, 
                    'issue': 'Should be application: False (Hidden/Shared/Integration)',
                    'current_section': phys_section
                })
        else:
            if phys_section != expected_section:
                output['miscategorized'].append({
                    'app': phys_tech,
                    'issue': f
