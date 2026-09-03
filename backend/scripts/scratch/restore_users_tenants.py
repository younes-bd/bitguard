import os
import sys
import django
import sqlite3

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.tenants.domain.models import Tenant
from apps.users.domain.models import User, TenantMembership
from django.db import IntegrityError

old_db = "backups/backup_20260718_204129.sqlite3"

def run_restore():
    conn = sqlite3.connect(old_db)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1. Restore Tenants
    cursor.execute("SELECT id, name, domain, subscription_plan, is_active FROM tenants_tenant")
    old_tenants = cursor.fetchall()
    restored_tenants = 0
    for t in old_tenants:
        try:
            if not Tenant.objects.filter(id=t['id']).exists() and not Tenant.objects.filter(domain=t['domain']).exists():
                Tenant.objects.create(
                    id=t['id'],
                    name=t['name'],
                    domain=t['domain'],
                    subscription_plan=t['subscription_plan'],
                    is_active=t['is_active']
                )
                restored_tenants += 1
        except IntegrityError:
            pass

    # 2. Restore Users
    cursor.execute("SELECT id, username, email, password, first_name, last_name, is_active, is_superuser, is_staff, date_joined FROM users_user")
    old_users = cursor.fetchall()
    restored_users = 0
    for u in old_users:
        try:
            if not User.objects.filter(id=u['id']).exists() and not User.objects.filter(email=u['email']).exists():
                user = User(
                    id=u['id'],
                    username=u['username'],
                    email=u['email'],
                    first_name=u['first_name'],
                    last_name=u['last_name'],
                    is_active=u['is_active'],
                    is_superuser=u['is_superuser'],
                    is_staff=u['is_staff'],
                    date_joined=u['date_joined']
                )
                user.password = u['password'] # raw hash
                user.save()
                restored_users += 1
        except IntegrityError:
            pass

    # 3. Restore Memberships
    cursor.execute("SELECT tenant_id, user_id FROM users_tenantmembership")
    old_memberships = cursor.fetchall()
    restored_mem = 0
    for m in old_memberships:
        if Tenant.objects.filter(id=m['tenant_id']).exists() and User.objects.filter(id=m['user_id']).exists():
            mem, created = TenantMembership.objects.get_or_create(
                tenant_id=m['tenant_id'],
                user_id=m['user_id']
            )
            if created:
                restored_mem += 1
                
    # 4. Fallback membership for users that had a tenant field but not membership (if schema was older)
    # Actually wait, backup_20260718_204129.sqlite3 has users_tenantmembership, so they should be there.

    print(f"Restored {restored_tenants} tenants.")
    print(f"Restored {restored_users} users.")
    print(f"Restored {restored_mem} memberships.")

if __name__ == '__main__':
    run_restore()
