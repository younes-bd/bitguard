import os
import ast
import shutil

def clean_manifests(base_dir):
    apps_dir = os.path.join(base_dir, 'apps')
    
    for app_name in os.listdir(apps_dir):
        app_path = os.path.join(apps_dir, app_name)
        if not os.path.isdir(app_path):
            continue
            
        manifest_path = os.path.join(app_path, '__manifest__.py')
        
        # Remove manifest from __pycache__ or other invalid folders
        if app_name.startswith('__') or app_name.startswith('.'):
            if os.path.exists(manifest_path):
                os.remove(manifest_path)
                print(f"Removed invalid manifest from {app_name}")
            continue

if __name__ == '__main__':
    clean_manifests('.')
