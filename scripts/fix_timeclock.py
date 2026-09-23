import os

path = 'backend/apps/timeclock/migrations/0002_initial.py'
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('employees_attendance', 'hr_attendance')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed employees_attendance")
