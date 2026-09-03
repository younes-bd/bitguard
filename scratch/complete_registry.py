import os

BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
BACKEND_DIR = os.path.normpath(BACKEND_DIR)

SKIP_API_APPS = {'core', 'tenants', 'automation', 'studio', 'barcode', 'iot', 'portal'}

APPS_DIR = os.path.join(BACKEND_DIR, 'apps')
INTEGRATIONS_DIR = os.path.join(BACKEND_DIR, 'integrations')

def get_apps(directory):
    return [d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d)) and not d.startswith('__')]

all_modules = [(APPS_DIR, app, 'apps') for app in get_apps(APPS_DIR)] + \
              [(INTEGRATIONS_DIR, app, 'integrations') for app in get_apps(INTEGRATIONS_DIR)]

created_count = 0
updated_count = 0

for base_dir, app_name, pillar_prefix in all_modules:
    if app_name in SKIP_API_APPS:
        continue
        
    app_dir = os.path.join(base_dir, app_name)
    apps_py = os.path.join(app_dir, 'apps.py')
    api_dir = os.path.join(app_dir, 'api')
    api_urls = os.path.join(api_dir, 'urls.py')
    
    # Ensure api/urls.py exists
    if not os.path.exists(api_urls):
        os.makedirs(api_dir, exist_ok=True)
        open(os.path.join(api_dir, '__init__.py'), 'a').close()
        with open(api_urls, 'w', encoding='utf-8') as f:
            f.write(f'from django.urls import path\n\nurlpatterns = [\n    # Stub routes for {app_name}\n]\n')
        print(f'Created api/urls.py for {app_name}')
        created_count += 1
        
    # Ensure apps.py exists
    if not os.path.exists(apps_py):
        camel_case_name = ''.join(word.title() for word in app_name.split('_'))
        with open(apps_py, 'w', encoding='utf-8') as f:
            f.write(f'''from django.apps import AppConfig\n\nclass {camel_case_name}Config(AppConfig):\n    default_auto_field = 'django.db.models.BigAutoField'\n    name = '{pillar_prefix}.{app_name}'\n    label = '{app_name}'\n''')
        print(f'Created apps.py for {app_name}')
        created_count += 1
        
    # Now patch apps.py to register
    with open(apps_py, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'core.api.registry' in content:
        continue
        
    url_prefix = 'home/' if app_name == 'website' else f'{app_name}/'
    urls_module = f'{pillar_prefix}.{app_name}.api.urls'
    
    register_block = (
        f"\n    def _register_api_routes(self):\n"
        f"        from apps.core.api.registry import register\n"
        f"        register('{url_prefix}', '{urls_module}')\n"
    )
    
    if 'def ready(self):' in content:
        content = content.replace(
            'def ready(self):',
            'def ready(self):\n        self._register_api_routes()'
        )
    else:
        content = content.rstrip() + '\n\n    def ready(self):\n        self._register_api_routes()\n'
        
    content = content.rstrip() + '\n' + register_block + '\n'
    
    with open(apps_py, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Registered {app_name} into Global Registry')
    updated_count += 1
    
print(f'\nDone! Updated {updated_count} apps and scaffolded {created_count} missing files.')
