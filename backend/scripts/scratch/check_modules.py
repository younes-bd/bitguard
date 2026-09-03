import sqlite3

db_path = "db.sqlite3"
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("SELECT * FROM system_erpmodule")
modules = [dict(row) for row in cursor.fetchall()]
print(modules)
