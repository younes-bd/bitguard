import sys
import os

file_path = 'backend/api/urls.py'
try:
    with open(file_path, 'r') as f:
        content = f.read()

    target = "    path('quality_control/', include('apps.quality_control.api.urls')),\n]"
    replacement = """    path('quality_control/', include('apps.quality_control.api.urls')),
    
    # Missing apps from A4 refactor
    path('equity/', include('apps.equity.urls')),
    path('esg/', include('apps.esg.urls')),
    path('hr/appraisals/', include('apps.hr_appraisal.urls')),
    path('hr/attendance/', include('apps.hr_attendance.urls')),
    path('hr/expenses/', include('apps.hr_expense.urls')),
    path('hr/holidays/', include('apps.hr_holidays.urls')),
    path('hr/payroll/', include('apps.hr_payroll.urls')),
    path('hr/recruitment/', include('apps.hr_recruitment.urls')),
]"""
    
    if target in content:
        new_content = content.replace(target, replacement)
        with open(file_path, 'w') as f:
            f.write(new_content)
        print('Successfully updated urls.py')
    else:
        print('Target string not found in urls.py')
except Exception as e:
    print(f'Error: {e}')
