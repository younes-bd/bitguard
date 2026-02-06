import os
import glob

def clean_migrations():
    # Base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    apps_dir = os.path.join(base_dir, 'apps')
    
    print(f"Scanning for migrations in {apps_dir}...")
    
    # Walk through apps directory
    for root, dirs, files in os.walk(apps_dir):
        if 'migrations' in dirs:
            migrations_dir = os.path.join(root, 'migrations')
            print(f"Checking {migrations_dir}...")
            
            # Find all .py files in migrations folder
            migration_files = glob.glob(os.path.join(migrations_dir, '*.py'))
            
            for file_path in migration_files:
                filename = os.path.basename(file_path)
                # Delete all migration files except __init__.py
                if filename != '__init__.py':
                    try:
                        os.remove(file_path)
                        print(f"Deleted: {filename}")
                    except Exception as e:
                        print(f"Error deleting {file_path}: {e}")
            
            # Delete __pycache__ if exists
            pycache_dir = os.path.join(migrations_dir, '__pycache__')
            if os.path.exists(pycache_dir):
                import shutil
                try:
                    shutil.rmtree(pycache_dir)
                    print(f"Deleted cache: {pycache_dir}")
                except Exception as e:
                    print(f"Error deleting cache: {e}")

if __name__ == "__main__":
    confirm = input("This will delete all migration files (except __init__.py). Type 'yes' to proceed: ")
    if confirm.lower() == 'yes':
        clean_migrations()
        print("Migration files cleaned. Now delete db.sqlite3 and run makemigrations.")
    else:
        print("Operation cancelled.")
