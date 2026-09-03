import re

def replace_in_file(filepath, old, new):
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)

# HR Expense
replace_in_file('backend/apps/hr_expense/__manifest__.py', " display_name : Hr_expense ,
