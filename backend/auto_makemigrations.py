import os
import sys
import builtins

def fake_input(prompt=''):
    print(prompt, end='')
    return 'y'

builtins.input = fake_input

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")
    from django.core.management import execute_from_command_line
    sys.argv = ['manage.py', 'makemigrations']
    execute_from_command_line(sys.argv)
