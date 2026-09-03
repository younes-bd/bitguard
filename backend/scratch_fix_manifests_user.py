import os
import re

manifests = {
    'backend/apps/board/__manifest__.py': {
        'name': 'Board',
        'display_name': 'Board',
        'category': 'Sales',
        'command_center_section': 'Sales'
    },
    'backend/apps/livechat/__manifest__.py': {
        'category': 'Comms',
        'command_center_section': 'Comms'
    },
    'backend/apps/sms/__manifest__.py': {
        'category': 'Comms',
        'command_center_section': 'Comms'
    },
    'backend/integrations/whatsapp/__manifest__.py': {
        'category': 'Comms',
        'command_center_section': 'Comms'
    }
}

for path, updates in manifests.items():
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for key, value in updates.items():
        pattern = r" " + key + r" :\s*.*?,
