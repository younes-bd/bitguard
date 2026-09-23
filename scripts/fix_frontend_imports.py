import os
import re

MAPPING = {
    'hrService': 'employeesService',
    'stockService': 'inventoryService',
    'mrpService': 'manufacturingService',
    'discussService': 'chatService',
    'mailService': 'inboxService',
    'hrStore': 'employeesStore',
    'stockStore': 'inventoryStore',
    'mrpStore': 'manufacturingStore',
    'discussStore': 'chatStore',
    'mailStore': 'inboxStore',
    'hrAdminRoutes': 'employeesAdminRoutes',
    'stockAdminRoutes': 'inventoryAdminRoutes',
    'mrpAdminRoutes': 'manufacturingAdminRoutes',
    'discussAdminRoutes': 'chatAdminRoutes',
    'mailAdminRoutes': 'inboxAdminRoutes'
}

FRONTEND_DIR = os.path.abspath('frontend/src')

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    c = f.read()
                original = c
                for old, new in MAPPING.items():
                    c = c.replace(old, new)
                    # Also replace exact file imports like '../api/mailService'
                    c = c.replace(f"/{old}", f"/{new}")
                if c != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(c)
                    print(f"Fixed content in {file}")
            except Exception as e:
                print(f"Failed {file}: {e}")
print("Frontend imports fixed.")
