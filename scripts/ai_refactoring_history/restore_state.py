import sqlite3
import os
import uuid

db_path = os.path.expanduser("~/website13_db.sqlite3")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

sections = [
    ("Saless", 10),
    ("Services", 20),
    ("Accounting & Finance", 30),
    ("Inventory", 40),
    ("Manufacturing", 50),
    ("Website", 60),
    ("Journeys", 70),
    ("Human Resources", 80),
    ("Productivity", 90),
    ("Administration", 100),
    ("Other", 999)
]

try:
    cursor.execute("SELECT id FROM tenants_tenant LIMIT 1;")
    tenant_row = cursor.fetchone()
    tenant_id = tenant_row[0] if tenant_row else None

    if not tenant_id:
        print("No tenant found!")
        exit()

    for name, seq in sections:
        # Check if exists
        cursor.execute("SELECT id FROM core_commandcentersection WHERE name=?", (name,))
        existing = cursor.fetchone()
        
        if existing:
            cursor.execute("UPDATE core_commandcentersection SET sequence=?, is_deleted=0 WHERE id=?", (seq, existing[0]))
        else:
            new_id = uuid.uuid4().hex
            cursor.execute("""
                INSERT INTO core_commandcentersection (id, name, sequence, tenant_id, is_deleted)
                VALUES (?, ?, ?, ?, 0)
            """, (new_id, name, seq, tenant_id))
            
    # Also mark all modules as installed so the user can see them in the command center
    cursor.execute("UPDATE core_installedmodule SET is_installed=1;")
    
    conn.commit()
    print("Successfully restored Sections and set all modules to is_installed=True")
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
