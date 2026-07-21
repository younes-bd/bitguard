from django.core.management.base import BaseCommand
from apps.base_setup.domain.models import SystemSetting

DEFAULTS = [
    # Accounting
    {'key': 'accounting.fiscal_year_end', 'value': 'December', 'setting_type': 'string'},
    {'key': 'accounting.period_locking', 'value': 'true', 'setting_type': 'boolean'},
    {'key': 'accounting.global_tax_rate', 'value': '20', 'setting_type': 'integer'},
    {'key': 'accounting.default_payment_terms', 'value': 'Net 30', 'setting_type': 'string'},
    # CRM
    {'key': 'crm.lead_scoring', 'value': 'true', 'setting_type': 'boolean'},
    {'key': 'crm.auto_assign_leads', 'value': 'false', 'setting_type': 'boolean'},
    # Sales
    {'key': 'sales.quotation_validity_days', 'value': '30', 'setting_type': 'integer'},
    {'key': 'sales.online_signature', 'value': 'true', 'setting_type': 'boolean'},
    # Inventory
    {'key': 'inventory.default_warehouse', 'value': 'Main', 'setting_type': 'string'},
    {'key': 'inventory.low_stock_alerts', 'value': 'true', 'setting_type': 'boolean'},
    # General
    {'key': 'general.company_name', 'value': 'BitGuard', 'setting_type': 'string'},
    {'key': 'general.company_timezone', 'value': 'UTC', 'setting_type': 'string'},
    {'key': 'general.default_language', 'value': 'en_US', 'setting_type': 'string'},
]

class Command(BaseCommand):
    help = 'Seed default ERP module settings into SystemSetting'
    
    def handle(self, *args, **options):
        for s in DEFAULTS:
            obj, created = SystemSetting.objects.get_or_create(
                key=s['key'], tenant=None,
                defaults={'value': s['value'], 'setting_type': s['setting_type']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Seeded: {s['key']}"))
