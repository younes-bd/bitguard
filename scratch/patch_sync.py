import os
filepath = 'backend/apps/system/services/modules.py'
with open(filepath, 'r') as f:
    content = f.read()

import re
# We need to change the update_or_create logic to not overwrite is_installed
# Let's replace update_or_create with a manual get or create then update

old_code = '''                InstalledModule.objects.update_or_create(
                    tenant=tenant,
                    technical_name=app_name,
                    defaults={
                        'name': manifest.get('name', app_name.replace('_', ' ').title()),
                        'display_name': manifest.get('display_name', manifest.get('name', app_name.replace('_', ' ').title())),
                        'author': manifest.get('author', 'BitGuard'),
                        'version': manifest.get('version', '1.0'),
                        'category': manifest.get('category', 'Other'),
                        'command_center_section': manifest.get('command_center_section', ''),
                        'sequence': manifest.get('sequence', 99),
                        'summary': manifest.get('summary', ''),
                        'description': manifest.get('description', ''),
                        'icon': manifest.get('icon', 'Box'),
                        'depends': manifest.get('depends', []),
                        'installable': True,
                        'is_installed': True if app_name in ['apps', 'system'] else False,
                        'application': manifest.get('application', True),
                        'url': manifest.get('url', f'/admin/{app_name}'),
                        'website': manifest.get('website', ''),
                        'license': manifest.get('license', 'LGPL-3'),
                        'rating': float(manifest.get('rating', 0.0)),
                        'featured': bool(manifest.get('featured', False)),
                        'screenshots': manifest.get('screenshots', []),
                    }
                )'''

new_code = '''                module, created = InstalledModule.objects.get_or_create(
                    tenant=tenant,
                    technical_name=app_name,
                    defaults={
                        'is_installed': True if app_name in ['apps', 'system', 'base', 'core'] else False,
                    }
                )
                
                module.name = manifest.get('name', app_name.replace('_', ' ').title())
                module.display_name = manifest.get('display_name', manifest.get('name', app_name.replace('_', ' ').title()))
                module.author = manifest.get('author', 'BitGuard')
                module.version = manifest.get('version', '1.0')
                module.category = manifest.get('category', 'Other')
                module.command_center_section = manifest.get('command_center_section', '')
                module.sequence = manifest.get('sequence', 99)
                module.summary = manifest.get('summary', '')
                module.description = manifest.get('description', '')
                module.icon = manifest.get('icon', 'Box')
                module.depends = manifest.get('depends', [])
                module.installable = True
                
                if app_name in ['apps', 'system', 'base', 'core']:
                    module.is_installed = True
                    
                module.application = manifest.get('application', True)
                module.url = manifest.get('url', f'/admin/{app_name}')
                module.website = manifest.get('website', '')
                module.license = manifest.get('license', 'LGPL-3')
                module.rating = float(manifest.get('rating', 0.0))
                module.featured = bool(manifest.get('featured', False))
                module.screenshots = manifest.get('screenshots', [])
                module.save()'''

content = content.replace(old_code, new_code)

with open(filepath, 'w') as f:
    f.write(content)

print('Patched modules.py')
