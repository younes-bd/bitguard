import os, ast, pprint
filepath = 'backend/apps/system/__manifest__.py'
with open(filepath, 'r') as f:
    manifest = ast.literal_eval(f.read())

manifest['name'] = 'Settings'
manifest['summary'] = 'The master configuration gateway.'
manifest['command_center_section'] = 'Administration'
manifest['sequence'] = 1
manifest['application'] = True

new_content = pprint.pformat(manifest, sort_dicts=False, width=120).replace(" \n ,
