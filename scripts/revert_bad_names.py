import os

FRONTEND_DIR = os.path.abspath('frontend/src/apps')

def fix_bad_names():
    for root, dirs, files in os.walk(FRONTEND_DIR, topdown=False):
        for file in files:
            new_file = file
            new_file = new_file.replace('Temployeesead', 'Thread')
            new_file = new_file.replace('Einbox', 'Email')
            
            if new_file != file:
                os.rename(os.path.join(root, file), os.path.join(root, new_file))
                print(f"Reverted rename: {file} -> {new_file}")

fix_bad_names()
