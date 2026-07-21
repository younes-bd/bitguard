import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'services_%';")
tables = cursor.fetchall()
print("Services tables in DB:")
for table in tables:
    print(table[0])
conn.close()
