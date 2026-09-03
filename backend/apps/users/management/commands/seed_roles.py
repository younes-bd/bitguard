from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType
from apps.users.domain.models import Role, RolePermission
from apps.system.domain.models import SystemSetting

class Command(BaseCommand):
    help = 'Seeds default roles, permissions, and system settings.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding roles and permissions...')

        # 1. Seed Roles
        default_roles = [
            ('SUPER_ADMIN', 'Super Administrator with full access'),
            ('TENANT_ADMIN', 'Administrator for a specific tenant'),
            ('MANAGER', 'General Manager'),
            ('HR_MANAGER', 'Human Resources Manager'),
            ('ACCOUNTANT', 'Accountant'),
            ('SALES_MANAGER', 'Sales Manager'),
            ('SALESPERSON', 'Sales Representative'),
            ('WAREHOUSE_MANAGER', 'Warehouse Manager'),
            ('EMPLOYEE', 'Standard Employee'),
            ('PORTAL_USER', 'External Portal User'),
        ]

        roles_dict = {}
        for role_name, description in default_roles:
            role, created = Role.objects.get_or_create(
                name=role_name,
                defaults={'description': description}
            )
            roles_dict[role_name] = role
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created role: {role_name}'))

        # 2. Assign SUPER_ADMIN all permissions for all content types
        super_admin = roles_dict.get('SUPER_ADMIN')
        if super_admin:
            all_content_types = ContentType.objects.all()
            for ct in all_content_types:
                # Exclude some Django internal tables if needed, but for SUPER_ADMIN, usually we grant all
                RolePermission.objects.get_or_create(
                    role=super_admin,
                    content_type=ct,
                    defaults={
                        'can_read': True,
                        'can_write': True,
                        'can_create': True,
                        'can_delete': True,
                    }
                )
            self.stdout.write(self.style.SUCCESS('Assigned all permissions to SUPER_ADMIN.'))

        # 3. Seed Default System Settings (for the default tenant or global)
        # Assuming these are stored with tenant=None or a default tenant
        default_settings = [
            ('company_name', 'BitGuard Enterprise'),
            ('timezone', 'UTC'),
            ('default_currency', 'USD'),
            ('date_format', 'YYYY-MM-DD'),
            ('language', 'en-us'),
        ]

        for key, value in default_settings:
            # We assume SystemSetting handles its own unique constraints
            setting, created = SystemSetting.objects.get_or_create(
                key=key,
                tenant=None, # global setting
                defaults={'value': value, 'category': 'general'}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created global setting: {key}'))

        self.stdout.write(self.style.SUCCESS('Seeding complete!'))
