import sqlite3

db_path = '/home/youness/website13/backend/db.sqlite3'
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Rename ITSM -> Services
try:
    c.execute("ALTER TABLE itsm_servicecategory RENAME TO services_servicecategory")
    c.execute("ALTER TABLE itsm_serviceitem RENAME TO services_serviceitem")
    c.execute("ALTER TABLE itsm_servicerequest RENAME TO services_servicerequest")
    print("Renamed itsm tables to services")
except Exception as e:
    print(f"itsm rename error: {e}")

# Rename ITAM -> Assets
try:
    c.execute("ALTER TABLE itam_asset RENAME TO assets_asset")
    c.execute("ALTER TABLE itam_assetassignment RENAME TO assets_assetassignment")
    c.execute("ALTER TABLE itam_maintenancerecord RENAME TO assets_maintenancerecord")
    c.execute("ALTER TABLE itam_softwarelicense RENAME TO assets_softwarelicense")
    print("Renamed itam tables to assets")
except Exception as e:
    print(f"itam rename error: {e}")

# Delete old migrations from django_migrations to allow fake to work cleanly
c.execute("DELETE FROM django_migrations WHERE app IN ('itsm', 'itam')")

# For cms, support, notifications: they are already in the DB, so we should delete them from django_migrations so they get faked too!
c.execute("DELETE FROM django_migrations WHERE app IN ('cms', 'notifications', 'helpdesk', 'services', 'maintenance')")

conn.commit()
conn.close()
print("DB fix applied to WSL database.")
