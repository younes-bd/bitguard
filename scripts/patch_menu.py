import re

file_path = "src/core/api/menu.js"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change the key `inventory: [` to `stock: [`
content = re.sub(r'^\s+inventory: \[', '    stock: [', content, flags=re.MULTILINE)

# 2. Change paths from `/admin/inventory/` to `/admin/stock/`
# also handle `/admin/inventory` exact
content = content.replace("path: '/admin/inventory/", "path: '/admin/stock/")
content = content.replace("path: '/admin/inventory'", "path: '/admin/stock'")

# 3. Change productMenu.inventory to productMenu.stock in EnterpriseRouter
router_path = "src/apps/board/routes/EnterpriseRouter.jsx"
with open(router_path, 'r', encoding='utf-8') as f:
    router_content = f.read()
    router_content = router_content.replace('productMenu.inventory', 'productMenu.stock')
with open(router_path, 'w', encoding='utf-8') as f:
    f.write(router_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated menu.js and EnterpriseRouter.jsx")
