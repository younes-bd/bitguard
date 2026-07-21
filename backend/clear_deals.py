import sqlite3
conn = sqlite3.connect('db.sqlite3')
conn.execute('DELETE FROM crm_deal')
conn.commit()
conn.close()
