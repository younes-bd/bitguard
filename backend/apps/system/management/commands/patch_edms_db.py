from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Patches the database after edms app rename to documents'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("UPDATE django_migrations SET app='documents' WHERE app='edms'")
            self.stdout.write(f"Updated {cursor.rowcount} rows in django_migrations")
            
            try:
                cursor.execute("UPDATE django_content_type SET app_label='documents' WHERE app_label='edms'")
                self.stdout.write(f"Updated {cursor.rowcount} rows in django_content_type")
            except Exception as e:
                self.stdout.write(f"django_content_type constraint error ignored: {e}")
                cursor.execute("DELETE FROM django_content_type WHERE app_label='edms'")
                self.stdout.write(f"Deleted old edms content types instead.")
            
        self.stdout.write(self.style.SUCCESS("Database patched successfully."))
