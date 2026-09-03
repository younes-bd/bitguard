"""
Management command to reset the admin account.
Usage:  python3 manage.py reset_admin
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Reset the admin@bitguard.tech account: set password to 'admin', unlock, activate."

    def handle(self, *args, **options):
        email = "admin@bitguard.tech"
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User {email} does not exist. Creating..."))
            user = User.objects.create_superuser(
                username=email,
                email=email,
                password="admin",
            )
            self.stdout.write(self.style.SUCCESS(f"Created superuser {email}"))
            return

        user.set_password("admin")
        user.is_active = True
        user.is_locked = False
        user.is_staff = True
        user.is_superuser = True
        user.failed_login_attempts = 0
        user.save()
        self.stdout.write(self.style.SUCCESS(
            f"✅ Account reset successfully:\n"
            f"   Email:    {email}\n"
            f"   Password: admin\n"
            f"   Active:   {user.is_active}\n"
            f"   Locked:   {user.is_locked}\n"
            f"   Staff:    {user.is_staff}\n"
            f"   Super:    {user.is_superuser}"
        ))
