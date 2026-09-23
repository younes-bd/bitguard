import os
import sqlite3

db_path = os.path.expanduser('~/website13_db.sqlite3')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute("UPDATE django_migrations SET app='plm' WHERE app='mrp_plm'")
    
    # Check if mrp_plm tables need renaming
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'mrp_plm_%'")
    tables = [r[0] for r in cur.fetchall()]
    for table in tables:
        new_table = table.replace('mrp_plm_', 'plm_', 1)
        cur.execute(f"ALTER TABLE {table} RENAME TO {new_table}")
        print(f"Renamed table {table} to {new_table}")
        
    conn.commit()
    conn.close()
    print("Fixed mrp_plm -> plm in DB.")
