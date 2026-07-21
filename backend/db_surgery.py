import sqlite3
import os

db_path = "/home/youness/website13/backend/db.sqlite3"

# Connect to SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def rename_table(old_name, new_name):
    try:
        cursor.execute(f"ALTER TABLE {old_name} RENAME TO {new_name};")
        print(f"Renamed {old_name} to {new_name}")
    except sqlite3.OperationalError as e:
        print(f"Failed to rename {old_name} to {new_name}: {e}")

# 1. Rename tables
rename_table("cms_page", "website_page")
rename_table("cms_servicepage", "website_servicepage")
rename_table("cms_mediaasset", "website_mediaasset")
rename_table("cms_course", "elearning_course")

# 2. Update Content Types
try:
    cursor.execute("UPDATE django_content_type SET app_label = 'website' WHERE app_label = 'cms' AND model IN ('page', 'servicepage', 'mediaasset');")
    cursor.execute("UPDATE django_content_type SET app_label = 'elearning' WHERE app_label = 'cms' AND model = 'course';")
    print(f"Updated content types: {cursor.rowcount} rows affected.")
except Exception as e:
    print("Content type error:", e)

# 3. Clean up migrations
try:
    cursor.execute("DELETE FROM django_migrations WHERE app = 'cms';")
    print(f"Deleted {cursor.rowcount} cms migrations.")
except Exception as e:
    pass

try:
    cursor.execute("DELETE FROM django_content_type WHERE app_label = 'cms';")
    print(f"Deleted remaining cms content types: {cursor.rowcount} rows affected.")
except Exception as e:
    pass

conn.commit()
conn.close()

print("Database surgery complete.")
