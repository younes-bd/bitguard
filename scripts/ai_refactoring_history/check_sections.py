import sqlite3
import os

db_path = os.path.expanduser("~/website13_db.sqlite3")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("SELECT id, name, sequence FROM core_commandcentersection;")
    print("Sections:")
    for row in cursor.fetchall():
        print(row)
        
    cursor.execute("SELECT technical_name, command_center_section, sequence FROM core_installedmodule WHERE application=1 LIMIT 10;")
    print("\nModules:")
    for row in cursor.fetchall():
        print(row)
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
