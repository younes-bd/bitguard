import os
import sys

# Monkey patch MigrationLoader.check_consistent_history
import django.db.migrations.loader as loader
loader.MigrationLoader.check_consistent_history = lambda *args, **kwargs: None

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    execute_from_command_line(sys.argv)
