import os
path = 'backend/apps/core/infrastructure/signals.py'
with open(path, 'r') as f:
    c = f.read()
c = c.replace('stock.inventoryitem', 'inventory.inventoryitem')
c = c.replace('stock.InventoryItem', 'inventory.InventoryItem')
with open(path, 'w') as f:
    f.write(c)
