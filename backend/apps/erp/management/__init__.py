from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Creates the __init__.py placeholder for the management package'

    def handle(self, *args, **kwargs):
        pass
