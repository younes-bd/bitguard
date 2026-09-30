import os
import shutil
from pathlib import Path

def prune_scratch():
    # Get the directory where this script is located (e.g. /workspace/scripts)
    script_dir = Path(__file__).resolve().parent
    
    # Get the project root (e.g. /workspace)
    project_root = script_dir.parent
    
    # Define the precise path to the .scratch folder
    scratch_dir = project_root / '.scratch'
    
    # Safety Check 1: Ensure we are only touching a folder named strictly '.scratch'
    if scratch_dir.name != '.scratch':
        print("CRITICAL ERROR: Path safety check failed.")
        return
        
    # Safety Check 2: Check if it actually exists
    if not scratch_dir.exists() or not scratch_dir.is_dir():
        print(f"Info: {scratch_dir} does not exist. Nothing to prune.")
        return
        
    print(f"Executing Tier-1 Garbage Collection on: {scratch_dir}")
    
    # Precise Deletion: Iterate through contents and delete, preserving the folder itself
    deleted_files = 0
    deleted_dirs = 0
    
    for item in scratch_dir.iterdir():
        try:
            if item.is_file() or item.is_symlink():
                item.unlink()
                deleted_files += 1
            elif item.is_dir():
                shutil.rmtree(item)
                deleted_dirs += 1
        except Exception as e:
            print(f"Failed to delete {item}. Reason: {e}")
            
    print(f"Success! Deleted {deleted_files} files and {deleted_dirs} directories.")
    print("Scratch environment is fully sanitized.")

if __name__ == "__main__":
    prune_scratch()
