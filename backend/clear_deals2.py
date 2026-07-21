import sqlite3
import os

db_path = '/home/youness/website13/backend/db.sqlite3'
if not os.path.exists(db_path):
    print(f"File not found: {db_path}")
else:
    conn = sqlite3.connect(db_path)
    conn.execute('DELETE FROM crm_deal')
    conn.commit()
    conn.close()
    print("crm_deal cleared successfully")
