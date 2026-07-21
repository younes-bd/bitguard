import sqlite3

def run():
    print("Connecting to sqlite3 database...")
    conn = sqlite3.connect('/home/youness/website13/backend/db.sqlite3', timeout=20)
    cursor = conn.cursor()
    
    print("Finding tenant...")
    cursor.execute("SELECT id FROM tenants_tenant WHERE domain='bitguard.tech' LIMIT 1")
    row = cursor.fetchone()
    
    if not row:
        print("Tenant not found!")
        # Create tenant if not found
        import uuid
        tenant_id = str(uuid.uuid4()).replace('-', '')
        cursor.execute("INSERT INTO tenants_tenant (id, domain, name, subscription_plan, is_active, is_deleted) VALUES (?, ?, ?, ?, ?, ?)", 
                       (tenant_id, 'bitguard.tech', 'BitGuard Technologies', 'enterprise', 1, 0))
    else:
        tenant_id = row[0]
        
    print(f"Using tenant_id: {tenant_id}")
    
    print("Updating websites...")
    cursor.execute("UPDATE website_website SET tenant_id = ? WHERE tenant_id IS NULL", (tenant_id,))
    print("Updating pages...")
    cursor.execute("UPDATE website_page SET tenant_id = ? WHERE tenant_id IS NULL", (tenant_id,))
    print("Updating menus...")
    cursor.execute("UPDATE website_websitemenu SET tenant_id = ? WHERE tenant_id IS NULL", (tenant_id,))
    print("Updating categories...")
    cursor.execute("UPDATE blog_category SET tenant_id = ? WHERE tenant_id IS NULL", (tenant_id,))
    print("Updating posts...")
    cursor.execute("UPDATE blog_post SET tenant_id = ? WHERE tenant_id IS NULL", (tenant_id,))
    
    conn.commit()
    conn.close()
    print("Done!")

if __name__ == '__main__':
    run()
