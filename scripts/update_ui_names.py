import os
import re

MAPPING = {
    'performance': 'Performance',
    'inbox': 'Inbox',
    'journeys': 'Journeys',
    'campaigns': 'Campaigns',
    'chat': 'Chat',
    'employees': 'Employees',
    'timeclock': 'Time & Attendance',
    'timeoff': 'Time Off',
    'quality': 'Quality',
    'purchase': 'Procurement',
    'reporting': 'Reports',
    'board': 'Analytics',
    'delivery': 'Fulfillment',
    'todo': 'Tasks',
    'livechat': 'Messaging',
    'elearning': 'Learning',
    'dispatch': 'Field Service'
}

BACKEND_DIR = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps'
FRONTEND_DIR = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/frontend/src/apps'

def update_manifest(app_name, new_name):
    manifest_path = os.path.join(BACKEND_DIR, app_name, '__manifest__.py')
    if not os.path.exists(manifest_path):
        return False
        
    with open(manifest_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Update 'name': '...'
    content = re.sub(r"(['\"]name['\"]\s*:\s*['\"])(.*?)(['\"])", r"\g<1>" + new_name + r"\g<3>", content, count=1)
    
    # Update 'display_name': '...'
    content = re.sub(r"(['\"]display_name['\"]\s*:\s*['\"])(.*?)(['\"])", r"\g<1>" + new_name + r"\g<3>", content)

    with open(manifest_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

def update_frontend_menu(app_name, new_name):
    menu_path = os.path.join(FRONTEND_DIR, app_name, 'config', 'menu.js')
    if not os.path.exists(menu_path):
        return False
        
    with open(menu_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Update displayName: '...'
    content = re.sub(r"(displayName\s*:\s*['\"])(.*?)(['\"])", r"\g<1>" + new_name + r"\g<3>", content)

    with open(menu_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

print("Starting UI Display Name updates...")
for app, new_name in MAPPING.items():
    backend_success = update_manifest(app, new_name)
    frontend_success = update_frontend_menu(app, new_name)
    print(f"[{app}] -> '{new_name}' | Backend: {'OK' if backend_success else 'Skip'} | Frontend: {'OK' if frontend_success else 'Skip'}")

print("\nDone! Please restart your Django server to load the new manifests.")
