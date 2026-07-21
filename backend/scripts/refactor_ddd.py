import os
import shutil
import re

def refactor_app(app_path):
    print(f'Refactoring {app_path}...')
    dirs = ['api', 'domain', 'application', 'infrastructure']
    for d in dirs:
        os.makedirs(os.path.join(app_path, d), exist_ok=True)
        init_path = os.path.join(app_path, d, '__init__.py')
        if not os.path.exists(init_path):
            open(init_path, 'w').close()

    # Move files
    moves = {
        'views.py': 'api/views.py',
        'urls.py': 'api/urls.py',
        'serializers.py': 'api/serializers.py',
        'permissions.py': 'api/permissions.py',
        'models.py': 'domain/models.py',
        'exceptions.py': 'domain/exceptions.py',
        'services.py': 'application/services.py',
        'signals.py': 'infrastructure/signals.py',
    }
    
    for src, dst in moves.items():
        src_path = os.path.join(app_path, src)
        dst_path = os.path.join(app_path, dst)
        if os.path.exists(src_path):
            shutil.move(src_path, dst_path)
            
    # Proxy models.py
    if os.path.exists(os.path.join(app_path, 'domain', 'models.py')):
        with open(os.path.join(app_path, 'models.py'), 'w') as f:
            f.write('from .domain.models import *\n')

    # Proxy services.py
    if os.path.exists(os.path.join(app_path, 'application', 'services.py')):
        with open(os.path.join(app_path, 'services.py'), 'w') as f:
            f.write('from .application.services import *\n')

    # Fix relative imports in all .py files recursively inside the app
    for root, _, files in os.walk(app_path):
        for file in files:
            if not file.endswith('.py'): continue
            
            # Skip proxy files
            if root == app_path and file in ['models.py', 'services.py']: continue
            
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            rel_level = os.path.relpath(root, app_path).count(os.sep) + 1
            if root == app_path: rel_level = 1
            
            dots = '.' * (rel_level)

            # Define replacements (from flat to DDD structure)
            # This is tricky because we don't know the exact file's depth.
            # If the file is inside api/ (rel_level=1), we want:
            # from .models -> from ..domain.models
            # from .services -> from ..application.services
            
            # Simple approach: let's replace exact strings for 1-level deep files.
            if root != app_path:
                content = re.sub(r'from \.models import', r'from ..domain.models import', content)
                content = re.sub(r'from \.services import', r'from ..application.services import', content)
                content = re.sub(r'from \.serializers import', r'from ..api.serializers import', content)
                content = re.sub(r'from \.exceptions import', r'from ..domain.exceptions import', content)
                content = re.sub(r'from \.signals import', r'from ..infrastructure.signals import', content)
                content = re.sub(r'from \.permissions import', r'from ..api.permissions import', content)
                content = re.sub(r'from \.constants import', r'from ..constants import', content)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

if __name__ == '__main__':
    base_apps = 'backend/apps'
    for app in os.listdir(base_apps):
        app_path = os.path.join(base_apps, app)
        if os.path.isdir(app_path) and app != '__pycache__':
            refactor_app(app_path)

