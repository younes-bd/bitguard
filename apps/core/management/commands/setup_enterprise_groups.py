from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = 'Setup standard Enterprise Groups and Permissions'

    def handle(self, *args, **options):
        # Define Roles
        roles = {
            'HR Manager': [
                'view_employeeprofile', 'add_employeeprofile', 'change_employeeprofile',
                'view_department', 'add_department',
                'view_payroll', 'add_payroll'
            ],
            'Supply Chain Manager': [
                'view_vendor', 'add_vendor', 'change_vendor',
                'view_inventory', 'change_inventory',
                'view_purchaseorder', 'add_purchaseorder'
            ],
            'Sales Manager': [
                'view_client', 'add_client', 'change_client',
                'view_deal', 'add_deal', 'change_deal',
                'view_contract'
            ],
            'Security Analyst': [
                'view_vulnerability', 'change_vulnerability',
                'view_incident', 'add_incident',
                'view_auditlog'
            ]
        }

        for role_name, perms in roles.items():
            group, created = Group.objects.get_or_create(name=role_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created group: {role_name}'))
            else:
                self.stdout.write(f'Group exists: {role_name}')

            # Assign permissions (simplified - assumes models exist)
            # In a real scenario, we'd lookup content types explicitly
            # For now, we'll try to find them loosely or skip if model doesn't exist yet
            for code in perms:
                try:
                    p = Permission.objects.get(codename=code)
                    group.permissions.add(p)
                    self.stdout.write(f'  + Added {code}')
                except Permission.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'  - Permission not found: {code} (Model might be missing)'))

        self.stdout.write(self.style.SUCCESS('Role setup complete.'))
