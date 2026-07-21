import sqlite3

def run():
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for t in tables:
        if 'tenant' in t[0] or 'website' in t[0] or 'blog' in t[0]:
            print(t[0])
    conn.close()

if __name__ == '__main__':
    run()
