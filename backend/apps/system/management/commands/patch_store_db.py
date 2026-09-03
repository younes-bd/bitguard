from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Patches the database after store app rename to ecommerce'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("UPDATE django_migrations SET app='ecommerce' WHERE app='store'")
            self.stdout.write(f"Updated {cursor.rowcount} rows in django_migrations")
            
            cursor.execute("UPDATE django_content_type SET app_label='ecommerce' WHERE app_label='store'")
            self.stdout.write(f"Updated {cursor.rowcount} rows in django_content_type")
            
        self.stdout.write(self.style.SUCCESS("Database patched successfully."))
