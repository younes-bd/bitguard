import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.tenants.domain.models import Tenant
from apps.users.domain.models import User, SecurityPolicy, RecordRule, Role, ContentType
from apps.base_setup.domain.models import SystemSetting, Language, OutgoingMailServer, EmailTemplate

def run_audit():
    print("=== STARTING SETTINGS & ERP CONFIGURATION AUDIT ===")
    
    # 1. Tenant Context Setup
    tenant, created = Tenant.objects.get_or_create(
        domain='bitguard.test',
        defaults={'name': 'BitGuard Test Corp'}
    )
    print(f"[*] Tenant resolved: {tenant.name} (Created: {created})")

    # 2. Languages Audit (Odoo: res.lang)
    print("\n--- Testing Languages (res.lang) ---")
    lang, created = Language.objects.get_or_create(
        tenant=tenant,
        code='fr_FR',
        defaults={'name': 'French (France)', 'direction': 'ltr'}
    )
    if created:
        print("[+] Created new language: French (fr_FR)")
    else:
        print("[*] Language French (fr_FR) already exists")
    
    active_langs = Language.objects.filter(tenant=tenant, is_active=True).count()
    print(f"[+] Total active languages for tenant: {active_langs}")

    # 3. System Settings Audit (Odoo: ir.config_parameter)
    print("\n--- Testing System Settings (ir.config_parameter) ---")
    setting, created = SystemSetting.objects.get_or_create(
        tenant=tenant,
        key='sale.default_discount',
        defaults={'value': '5', 'setting_type': 'integer', 'description': 'Default sale discount'}
    )
    if created:
        print(f"[+] Created system setting: {setting.key} = {setting.value}")
    else:
        print(f"[*] Setting {setting.key} = {setting.value} already exists")
        
    SystemSetting.objects.update_or_create(
        tenant=tenant, key='core.base_url',
        defaults={'value': 'https://bitguard.test', 'setting_type': 'string'}
    )
    print(f"[+] Updated core.base_url setting")

    # 4. Outgoing Mail Servers Audit (Odoo: ir.mail_server)
    print("\n--- Testing Mail Servers (ir.mail_server) ---")
    mail_server, created = OutgoingMailServer.objects.get_or_create(
        tenant=tenant,
        name='Main SMTP',
        defaults={
            'smtp_host': 'smtp.sendgrid.net',
            'smtp_port': 587,
            'smtp_encryption': 'starttls'
        }
    )
    print(f"[+] Outgoing mail server configured: {mail_server}")

    # 5. Security Policy Audit
    print("\n--- Testing Security Policy (Global) ---")
    policy, created = SecurityPolicy.objects.get_or_create(tenant=tenant)
    policy.enforce_mfa = True
    policy.min_password_length = 12
    policy.save()
    print(f"[+] Security Policy updated: MFA Enforced={policy.enforce_mfa}, Min Password Length={policy.min_password_length}")

    # 6. Record Rules Audit (Odoo: ir.rule)
    print("\n--- Testing Record Rules (ir.rule) ---")
    ct_user = ContentType.objects.get(app_label='users', model='user')
    role, _ = Role.objects.get_or_create(name='Salesperson')
    
    rule, created = RecordRule.objects.get_or_create(
        name='Salesperson Own Documents Only',
        role=role,
        content_type=ct_user,
        defaults={
            'domain_filter': [["user_id", "=", "current_user"]],
            'is_global': False
        }
    )
    print(f"[+] Row-Level Security Rule created/verified: {rule.name}")
    print(f"    Domain Filter: {rule.domain_filter}")

    print("\n=== AUDIT COMPLETED SUCCESSFULLY ===")

if __name__ == '__main__':
    run_audit()
