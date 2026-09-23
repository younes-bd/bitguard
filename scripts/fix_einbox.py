import os

path = 'backend/apps/inbox/migrations/0001_initial.py'
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('EinboxTemplate', 'EmailTemplate')
    c = c.replace('einboxtemplate', 'emailtemplate')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed EinboxTemplate in migration!")
