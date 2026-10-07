"""
Management command to seed the initial Tenant and Superuser for BitGuard.
Run: python manage.py seed_tenant
"""
from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = 'Seeds the initial BitGuard tenant and superuser account.'

    def add_arguments(self, parser):
        parser.add_argument('--name', default='BitGuard', help='Tenant name')
        parser.add_argument('--domain', default='localhost', help='Tenant domain')
        parser.add_argument('--email', default='admin@bitguard.com', help='Superuser email')
        parser.add_argument('--password', default='admin', help='Superuser password')

    def handle(self, *args, **options):
        from apps.tenants.domain.models import Tenant
        from apps.users.domain.models import User, TenantMembership

        with transaction.atomic():
            # 1. Create or get the default tenant
            tenant, t_created = Tenant.objects.get_or_create(
                domain=options['domain'],
                defaults={
                    'name': options['name'],
                    'is_active': True,
                }
            )
            if t_created:
                self.stdout.write(self.style.SUCCESS(f'Created Tenant: {tenant.name} (id={tenant.id})'))
            else:
                self.stdout.write(self.style.WARNING(f'Tenant already exists: {tenant.name} (id={tenant.id})'))

            # 2. Create or get the superuser
            user, u_created = User.objects.get_or_create(
                email=options['email'],
                defaults={
                    'username': options['email'],
                    'first_name': 'Admin',
                    'last_name': 'User',
                    'is_staff': True,
                    'is_superuser': True,
                }
            )
            if u_created:
                user.set_password(options['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Created Superuser: {user.email}'))
            else:
                self.stdout.write(self.style.WARNING(f'Superuser already exists: {user.email}'))

            # 3. Link user to tenant via TenantMembership
            membership, m_created = TenantMembership.objects.get_or_create(
                user=user,
                tenant=tenant,
                defaults={'is_active': True}
            )
            if m_created:
                self.stdout.write(self.style.SUCCESS(f'Linked {user.email} to tenant {tenant.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Membership already exists.'))

        self.stdout.write(self.style.SUCCESS('Seed complete! Log in with:'))
        self.stdout.write(f'  Email: {options["email"]}')
        self.stdout.write(f'  Password: {options["password"]}')
        self.stdout.write(f'  Tenant domain: {tenant.domain}')
