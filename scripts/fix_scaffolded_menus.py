import os
import re

apps = ['invoicing', 'consolidation', 'barcode', 'repair', 'forum', 'studio', 'voip', 'iot', 'lunch', 'mass_mailing']

for app in apps:
    menu_path = f"frontend/src/apps/{app}/config/menu.js"
    if os.path.exists(menu_path):
        with open(menu_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # The bad format looks like:
        # export const appMenu = [
        #     {
        #         label: 'Dashboard',
        #         path: '',
        #         icon: IconName,
        #     }
        # ];
        # We need to replace it with:
        # export const appMenu = [
        #     {
        #         title: 'Overview',
        #         items: [
        #             {
        #                 label: 'Dashboard',
        #                 path: '',
        #                 icon: IconName,
        #             }
        #         ]
        #     }
        # ];
        
        if "title:" not in content and "items:" not in content:
            # Simple replacement
            content = content.replace("    {\n        label:", "    {\n        title: 'Overview',\n        items: [\n            {\n                label:")
            content = content.replace("    }\n];", "            }\n        ]\n    }\n];")
            
            with open(menu_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed menu for {app}")
