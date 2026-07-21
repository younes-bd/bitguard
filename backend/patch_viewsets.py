import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all ViewSet classes
    class_pattern = re.compile(r'^class\s+([A-Za-z0-9_]+)\s*\((.*?)\):', re.MULTILINE)
    
    matches = list(class_pattern.finditer(content))
    if not matches:
        return
        
    lines = content.split('\n')
    new_lines = []
    
    in_viewset = False
    class_indent = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        
        match = class_pattern.match(line)
        if match:
            bases = match.group(2)
            # If it's a ModelViewSet or ViewSet
            if 'ModelViewSet' in bases or 'ViewSet' in bases:
                # Need to check if perform_destroy already exists in this class
                # We'll just append it right after the class declaration (after docstrings)
                # But wait, a simpler way is to just use a custom BaseViewSet or inject it.
                pass
        i += 1

# Actually, the safest and cleanest way is to create a core BaseViewSet in `apps/core/api/views.py`
# But replacing inheritance in all files is also a script.

# Let's just use Python's AST or regex to insert the method.
# Since we don't want to parse Python manually, overriding `delete()` on the Model is mathematically equivalent and much safer for Django apps.
# Let's check if the user will accept Model.delete().
