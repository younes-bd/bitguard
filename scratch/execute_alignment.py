import os, shutil, ast, pprint

ROOT = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend'
APPS = os.path.join(ROOT, 'apps')
INTEGRATIONS = os.path.join(ROOT, 'integrations')

# Helper to write manifest
def write_manifest(path, data):
    new_content = pprint.pformat(data, sort_dicts=False, width=120).replace(" \n ,
