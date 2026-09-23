import psycopg2

try:
    conn = psycopg2.connect(dbname='bitguard', user='youness', password='admin', host='127.0.0.1')
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("SELECT id, app_label, model FROM django_content_type WHERE app_label = 'system';")
    rows = cursor.fetchall()
    
    valid_models = ['installedmodule', 'integrationkey', 'commandcentersection'] 
    # wait, what models exist in system right now? IntegrationKey, InstalledModule, CommandCenterSection
    
    for r in rows:
        print(f"ID {r[0]}: {r[1]}.{r[2]}")
        
    print("--- Let's forcefully delete the ghost ones! ---")
    ghost_models = ['systemsetting', 'webhookendpoint', 'databasebackup', 'apikey']
    
    for g in ghost_models:
        cursor.execute("DELETE FROM django_content_type WHERE app_label = 'system' AND model = %s;", (g,))
        print(f"Deleted {g}")
        
except Exception as e:
    print(e)
