import sqlite3
import os

db_path = "/home/youness/website13/backend/db.sqlite3"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables starting with 'inventory_'
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'inventory_%';")
    tables = cursor.fetchall()
    
    for (table_name,) in tables:
        new_name = table_name.replace('inventory_', 'stock_', 1)
        print(f"Renaming {table_name} to {new_name}")
        cursor.execute(f"ALTER TABLE {table_name} RENAME TO {new_name};")
    
    # Wait, the DeliveryNote model is moved to `delivery`, so it should be `delivery_deliverynote` not `stock_deliverynote`?
    # Django migration `stock.0004_delete_deliverynote` will try to delete `stock_deliverynote` (which we just renamed it to).
    # And `delivery.0001_initial` will try to create `delivery_deliverynote`.
    # This is perfect!
    
    conn.commit()
    conn.close()
    print("Database tables renamed.")
else:
    print(f"{db_path} not found!")
