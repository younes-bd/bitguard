import sqlite3

db_path = "backups/backup_20260718_204129.sqlite3"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(tenants_tenant)")
print("Tenants columns:", [row[1] for row in cursor.fetchall()])

cursor.execute("PRAGMA table_info(users_user)")
print("Users columns:", [row[1] for row in cursor.fetchall()])

cursor.execute("PRAGMA table_info(users_tenantmembership)")
print("Membership columns:", [row[1] for row in cursor.fetchall()])
