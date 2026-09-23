import sqlite3
import os

db_path = os.path.expanduser("~/website13_db.sqlite3")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("SELECT count(*) FROM core_commandcentersection;")
    print("Sections count:", cursor.fetchone()[0])
    
    cursor.execute("SELECT count(*) FROM core_installedmodule;")
    print("Modules count:", cursor.fetchone()[0])
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
