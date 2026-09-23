import sqlite3
import os

db_path = os.path.expanduser("~/website13_db.sqlite3")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS "base_setup_commandcentersection" (
        "id" char(32) NOT NULL PRIMARY KEY,
        "is_deleted" bool NOT NULL,
        "created_at" datetime NULL,
        "updated_at" datetime NULL,
        "name" varchar(100) NOT NULL,
        "sequence" integer NOT NULL,
        "tenant_id" char(32) NULL REFERENCES "tenants_tenant" ("id"),
        "created_by_id" integer NULL REFERENCES "users_user" ("id")
    );
    """)
    cursor.execute("""
    CREATE UNIQUE INDEX IF NOT EXISTS "base_setup_commandcentersection_tenant_id_name_idx" 
    ON "base_setup_commandcentersection" ("tenant_id", "name");
    """)
    conn.commit()
    print("Successfully created base_setup_commandcentersection")
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
