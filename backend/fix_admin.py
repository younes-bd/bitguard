import re

admin_path = "apps/stock/admin.py"

with open(admin_path, 'r', encoding='utf-8') as f:
    content = f.read()

# remove delivery note admin block
content = re.sub(r'@admin\.register\(models\.DeliveryNote\).*?(?=@admin|\Z)', '', content, flags=re.DOTALL)

with open(admin_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated admin.py")
