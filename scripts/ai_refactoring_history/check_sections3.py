import sqlite3
import os

db_path = os.path.expanduser("~/website13_db.sqlite3")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("SELECT DISTINCT command_center_section FROM core_installedmodule;")
    for row in cursor.fetchall():
        print(row)
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
