import os
import re

backend_dir = 'backend'
frontend_dir = 'frontend/src'

def scan_dir(directory, patterns):
    matches = []
    for root, dirs, files in os.walk(directory):
        for f in files:
            if not f.endswith('.py') and not f.endswith('.js') and not f.endswith('.jsx') and not f.endswith('.md'):
                continue
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
                for pattern in patterns:
                    if re.search(pattern, content):
                        matches.append(path)
                        break
    return matches

print("BACKEND MATCHES (apps.core | api/core):")
b_matches = scan_dir(backend_dir, [r'apps\.core', r'api/core'])
for m in b_matches: print(m)

print("\nFRONTEND MATCHES (apps/core | api/core):")
f_matches = scan_dir(frontend_dir, [r'apps/core', r'api/core'])
for m in f_matches: print(m)
