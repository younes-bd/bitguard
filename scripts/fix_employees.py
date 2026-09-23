import os

path = 'backend/apps/employees/migrations/0002_initial.py'
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('employeesm_time_entries', 'hrm_time_entries')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed employeesm_time_entries")
