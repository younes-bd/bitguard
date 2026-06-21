import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
print("Setting up django...")
django.setup()
print("Done.")
