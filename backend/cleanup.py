import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
conn = sqlite3.connect(db_path)
conn.execute('DELETE FROM scm_purchaseorder WHERE vendor_id NOT IN (SELECT id FROM scm_vendor);')
conn.commit()
conn.close()
print("deleted orphans")
