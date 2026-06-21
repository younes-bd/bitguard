import sqlite3

conn = sqlite3.connect('db.sqlite3')
c = conn.cursor()
c.execute("SELECT id, app, name, applied FROM django_migrations WHERE app IN ('cms', 'services') ORDER BY id")
for row in c.fetchall():
    print(row)
conn.close()
