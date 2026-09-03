from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.contrib.auth import get_user_model
from apps.users.domain.models import Role, RolePermission, UserRole, TenantMembership
from apps.tenants.domain.models import Tenant
from apps.core.domain.models import Partner
import uuid

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds a Tech Company with realistic roles, permissions, users, and tenants.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding Tech Company...')

        # 1. Clear previous seed data for this script if needed (optional)
        tenant_domain = 'tech-innovators.com'
        Tenant.objects.filter(domain=tenant_domain).delete()

        # 2. Create the Tech Company Tenant
        partner = Partner.objects.create(
            name="Tech Innovators Inc.",
            email="contact@tech-innovators.com",
            partner_type="internal",
        )
        tenant = Tenant.objects.create(
            name="Tech Innovators Workspace",
            partner=partner,
            domain=tenant_domain,
            subscription_plan="enterprise",
        )
        self.stdout.write(self.style.SUCCESS(f'Created Tenant: {tenant.name}'))

        # 3. Define Roles and Permissions
        roles_data = [
            {
                'name': 'TECH_ADMIN',
                'description': 'Full access to all apps and settings.',
                'category': 'Tech'
            },
            {
                'name': 'HR_MANAGER',
                'description': 'Access to employee records and timesheets.',
                'category': 'HR'
            },
            {
                'name': 'TECH_SUPPORT',
                'description': 'Access to ticketing, CRM leads, read-only assets.',
                'category': 'Tech'
            },
            {
                'name': 'DEVELOPER',
                'description': 'Access to projects, tasks, timesheets.',
                'category': 'Tech'
            },
            {
                'name': 'PORTAL_VENDOR',
                'description': 'External partner, restricted portal access.',
                'category': 'External'
            }
        ]

        roles_dict = {}
        for r_data in roles_data:
            role, created = Role.objects.get_or_create(
                name=r_data['name'],
                defaults={'description': r_data['description'], 'category': r_data['category']}
            )
            roles_dict[r_data['name']] = role
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created role: {r_data['name']}"))

        # Define ContentTypes
        user_ct = ContentType.objects.get(app_label='users', model='user')
        tenant_ct = ContentType.objects.get(app_label='tenants', model='tenant')
        try:
            setting_ct = ContentType.objects.get(app_label='system', model='systemsetting')
        except ContentType.DoesNotExist:
            setting_ct = None

        # Assign Permissions
        def assign_perms(role_name, ct, r, w, c, d):
            if not ct:
                return
            role = roles_dict[role_name]
            RolePermission.objects.update_or_create(
                role=role,
                content_type=ct,
                defaults={'can_read': r, 'can_write': w, 'can_create': c, 'can_delete': d}
            )

        assign_perms('TECH_ADMIN', user_ct, True, True, True, True)
        assign_perms('TECH_ADMIN', tenant_ct, True, True, True, True)
        assign_perms('TECH_ADMIN', setting_ct, True, True, True, True)

        assign_perms('HR_MANAGER', user_ct, True, True, True, False)
        assign_perms('HR_MANAGER', tenant_ct, True, False, False, False)
        assign_perms('HR_MANAGER', setting_ct, False, False, False, False)

        assign_perms('TECH_SUPPORT', user_ct, True, False, False, False)
        assign_perms('TECH_SUPPORT', tenant_ct, False, False, False, False)
        assign_perms('TECH_SUPPORT', setting_ct, False, False, False, False)

        assign_perms('DEVELOPER', user_ct, True, False, False, False)
        assign_perms('DEVELOPER', tenant_ct, False, False, False, False)
        assign_perms('DEVELOPER', setting_ct, False, False, False, False)

        assign_perms('PORTAL_VENDOR', user_ct, False, False, False, False)
        assign_perms('PORTAL_VENDOR', tenant_ct, False, False, False, False)
        assign_perms('PORTAL_VENDOR', setting_ct, False, False, False, False)

        self.stdout.write(self.style.SUCCESS("Assigned permissions to roles."))

        # 4. Generate Users
        users_to_create = [
            {'email': 'admin@tech-innovators.com', 'role': 'TECH_ADMIN', 'first': 'Admin', 'last': 'User'},
            {'email': 'hr@tech-innovators.com', 'role': 'HR_MANAGER', 'first': 'HR', 'last': 'Manager'},
            {'email': 'support@tech-innovators.com', 'role': 'TECH_SUPPORT', 'first': 'Support', 'last': 'Agent'},
            {'email': 'dev1@tech-innovators.com', 'role': 'DEVELOPER', 'first': 'Dev', 'last': 'One'},
            {'email': 'vendor@external.com', 'role': 'PORTAL_VENDOR', 'first': 'Vendor', 'last': 'Partner'},
        ]

        for u_data in users_to_create:
            username = u_data['email'].split('@')[0]
            User.objects.filter(email=u_data['email']).delete()
            User.objects.filter(username=username).delete()

            user = User.objects.create_user(
                username=username,
                email=u_data['email'],
                password='password123',
                first_name=u_data['first'],
                last_name=u_data['last'],
                is_active=True
            )
            
            u_partner = Partner.objects.create(
                name=f"{u_data['first']} {u_data['last']}",
                email=u_data['email'],
                partner_type="internal" if u_data['role'] != 'PORTAL_VENDOR' else "supplier",
                tenant=tenant
            )
            user.partner = u_partner
            user.save()

            role = roles_dict[u_data['role']]
            UserRole.objects.create(user=user, role=role)

            TenantMembership.objects.create(
                user=user,
                tenant=tenant,
                is_active=True
            )

            self.stdout.write(self.style.SUCCESS(f"Created user {user.email} with role {role.name}"))

        self.stdout.write(self.style.SUCCESS('Tech Company seeding completed successfully!'))
