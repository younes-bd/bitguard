import os

files = [
    'api/urls.py',
    'apps/core/management/commands/seed_demo.py',
    'apps/board/services/analytics.py',
    'apps/hr/apps.py',
    'apps/hr/infrastructure/signals.py',
    'apps/hr/tests/test_payroll_engine.py',
    'config/settings/base.py',
    'e2e_workflow_test.py',
    'test_dashboard2.py'
]

for file in files:
    path = file # relative path
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content.replace('apps.hrm', 'apps.hr').replace('path(\'hrm/\', include(\'apps.hr.api.urls\'))', 'path(\'hr/\', include(\'apps.hr.api.urls\'))')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
    else:
        print(f"Not found: {file}")
