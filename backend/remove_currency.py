import os

file_path = "apps/accounting/domain/models.py"
with open(file_path, "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.startswith("class Currency(TenantAwareModel):"):
        skip = True
    
    if not skip:
        new_lines.append(line)
        
    if skip and line.strip() == 'return f"{self.code} - {self.name}"':
        skip = False

with open(file_path, "w") as f:
    f.writelines(new_lines)
