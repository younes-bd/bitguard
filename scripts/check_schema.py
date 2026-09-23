import sqlite3
import os

db_path = os.path.expanduser('~/website13_db.sqlite3')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(accounting_invoice)")
    for row in cur.fetchall():
        print(row)
    conn.close()
