import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from django.core.management import call_command

apps = ['appointments', 'planning']

with open("makemig_apps.log", "w") as f:
    try:
        call_command('makemigrations', *apps, stdout=f)
        call_command('migrate', stdout=f)
    except Exception as e:
        f.write("ERROR: " + str(e))
