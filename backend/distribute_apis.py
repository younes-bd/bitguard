import os
import shutil

BASE_DIR = r"c:\Users\youne\Desktop\2-InfoTech\website\website13\backend\apps"

apps = ['hr_attendance', 'hr_holidays', 'hr_recruitment', 'hr_payroll', 'hr_appraisal', 'hr_expense']

for app in apps:
    # We will create basic urls.py and serializers.py and views.py by just writing boilerplate for now, 
    # but the frontend doesn't even use these endpoints yet (only hr uses employees).
    
    # We'll just touch the files so they exist.
    with open(os.path.join(BASE_DIR, app, 'serializers.py'), 'w') as f:
        f.write("from rest_framework import serializers\n")
    with open(os.path.join(BASE_DIR, app, 'urls.py'), 'w') as f:
        f.write("from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nrouter = DefaultRouter()\nurlpatterns = [path('', include(router.urls))]\n")
