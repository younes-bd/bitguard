import os
import re

replacements = {
    r'\bpurchase\b': 'procurement',
    r'\bboard\b': 'analytics',
    r'\breporting\b': 'reports',
    r'\bdelivery\b': 'shipping',
    r'\btodo\b': 'tasks',
    r'\blivechat\b': 'messaging',
    r'\belearning\b': 'learning',
    r'\bmrp\b': 'manufacturing',
    r'\bmarketing\b': 'journeys',
    r'\bplm\b': 'mrp_plm',
    r'\bhr\b': 'employees',
    r'\bhr_attendance\b': 'timeclock',
    r'\bhr_timesheet\b': 'timesheets',
    r'\bhr_holidays\b': 'timeoff',
    r'\bhr_recruitment\b': 'recruiting',
    r'\bhr_payroll\b': 'payroll',
    r'\bhr_appraisal\b': 'performance',
    r'\bhr_expense\b': 'expenses',
    r'\bstock\b': 'inventory',
    r'\bsale\b': 'sales',
    r'\bquality_control\b': 'quality',
    r'\bfield_service\b': 'dispatch',
    r'\bchat\b': 'discuss',
    r'\bmail\b': 'inbox'
}

files_to_update = [
    'SYSTEM_ARCHITECTURE_MAP.md',
    '.agents/rules/architecture.md'
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements.items():
        # Using a simplistic replacement just for exact backtick or list matches
        # We only want to replace the module names when they appear in lists or backticks.
        content = re.sub(f"`{old.strip(r'\\b')}`", f"`{new}`", content)
        content = re.sub(f" {old.strip(r'\\b')},", f" {new},", content)
        content = re.sub(f" {old.strip(r'\\b')} ", f" {new} ", content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
print("Updated architecture files.")
