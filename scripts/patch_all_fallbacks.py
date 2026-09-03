import os

file_path = "src/apps/board/routes/EnterpriseRouter.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_module_layout = False
module_indent = ""
has_wildcard = False

for i, line in enumerate(lines):
    if '<Route path="' in line and 'element={<ModuleLayout' in line:
        in_module_layout = True
        module_indent = line[:len(line) - len(line.lstrip())]
        has_wildcard = False
        new_lines.append(line)
        continue
    
    if in_module_layout:
        if '<Route path="*"' in line:
            has_wildcard = True
        
        if line.strip() == '</Route>':
            # End of module layout block
            if not has_wildcard:
                # Add wildcard fallback before closing tag
                new_lines.append(f'{module_indent}    <Route path="*" element={{<Navigate to="" replace />}} />\n')
            in_module_layout = False
            
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("EnterpriseRouter.jsx fallbacks patched successfully!")
