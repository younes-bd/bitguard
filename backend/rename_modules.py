import os
import shutil
import re
import sqlite3

def rename_app(base_dir, old_name, new_name):
    # 1. Rename backend directory
    backend_app_path = os.path.join(base_dir, "backend", "apps", old_name)
    new_backend_app_path = os.path.join(base_dir, "backend", "apps", new_name)
    if os.path.exists(backend_app_path):
        os.rename(backend_app_path, new_backend_app_path)
        print(f"Renamed {backend_app_path} to {new_backend_app_path}")
    
    # 2. Rename frontend directory
    frontend_app_path = os.path.join(base_dir, "frontend", "src", "apps", old_name)
    new_frontend_app_path = os.path.join(base_dir, "frontend", "src", "apps", new_name)
    if os.path.exists(frontend_app_path):
        os.rename(frontend_app_path, new_frontend_app_path)
        print(f"Renamed {frontend_app_path} to {new_frontend_app_path}")

def update_file_contents(file_path, old_name, new_name):
    if not os.path.exists(file_path):
        return
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return
    
    # Need to be very careful with string replacements to avoid replacing 'maintenance' in css/js imports like 'assets/img.png'
    # We will only replace specific code constructs
    
    new_content = content
    
    if old_name == 'maintenance':
        # Don't replace generic "maintenance" because it could be an image folder
        # Be more specific for "maintenance":
        replacements = [
            (f"'{old_name}.", f"'{new_name}."),
            (f'"{old_name}.', f'"{new_name}.'),
            (f"apps.{old_name}", f"apps.{new_name}"),
            (f"from {old_name}", f"from {new_name}"),
            (f"from apps import {old_name}", f"from apps import {new_name}"),
            (f"/{old_name}/", f"/{new_name}/"),
            (f"'{old_name}'", f"'{new_name}'"),
            (f'"{old_name}"', f'"{new_name}"')
        ]
    else:
        replacements = [
            (f"'{old_name}.", f"'{new_name}."),
            (f'"{old_name}.', f'"{new_name}.'),
            (f"apps.{old_name}", f"apps.{new_name}"),
            (f"from {old_name}", f"from {new_name}"),
            (f"import {old_name}", f"import {new_name}"),
            (f"({old_name})", f"({new_name})"),
            (f"'{old_name}'", f"'{new_name}'"),
            (f'"{old_name}"', f'"{new_name}"'),
            (f"/{old_name}/", f"/{new_name}/")
        ]
        
    for old_str, new_str in replacements:
        new_content = new_content.replace(old_str, new_str)
    
    # Specific class rename for apps.py
    if file_path.endswith('apps.py'):
        new_content = new_content.replace(old_name.capitalize() + 'Config', new_name.replace('_', ' ').title().replace(' ', '') + 'Config')
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated contents of {file_path}")

def update_all_files(base_dir, renames):
    # Walk through all python and js files
    for root, dirs, files in os.walk(base_dir):
        if '__pycache__' in root or 'node_modules' in root or '.git' in root or 'venv' in root or 'public' in root or 'dist' in root:
            continue
        for file in files:
            if file.endswith('.py') or file.endswith('.js') or file.endswith('.jsx'):
                file_path = os.path.join(root, file)
                for old_name, new_name in renames.items():
                    update_file_contents(file_path, old_name, new_name)

def update_database(renames):
    db_path = "/home/youness/website13/backend/db.sqlite3"
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    for old_name, new_name in renames.items():
        # Update django_migrations table
        cursor.execute(f"UPDATE django_migrations SET app='{new_name}' WHERE app='{old_name}';")
        
        # Rename tables
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '{old_name}_%';")
        tables = cursor.fetchall()
        for (table_name,) in tables:
            new_table_name = table_name.replace(f"{old_name}_", f"{new_name}_", 1)
            cursor.execute(f"ALTER TABLE {table_name} RENAME TO {new_table_name};")
            print(f"Renamed table {table_name} to {new_table_name}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    # Base dir assumes we run this from inside backend
    base_dir = os.path.abspath(os.path.join(os.getcwd(), ".."))
    
    renames = {
        "maintenance": "maintenance",
        "mrp_plm": "mrp_plm",
        "quality_control": "quality_control"
    }
    
    # 1. Rename directories
    for old, new in renames.items():
        rename_app(base_dir, old, new)
        
    # 2. Update files
    update_all_files(base_dir, renames)
    
    # 3. Update DB
    update_database(renames)
    
    print("Done renaming modules.")
