from django.core.management.base import BaseCommand

DEFAULT_COA = [
    # Assets (1000s)
    {'code': '1000', 'name': 'Cash and Bank', 'account_type': 'asset', 'description': 'All cash on hand and bank balances'},
    {'code': '1100', 'name': 'Accounts Receivable', 'account_type': 'asset', 'description': 'Money owed by customers'},
    {'code': '1200', 'name': 'Prepaid Expenses', 'account_type': 'asset', 'description': 'Expenses paid in advance'},
    {'code': '1300', 'name': 'Inventory', 'account_type': 'asset', 'description': 'Goods held for sale'},
    {'code': '1500', 'name': 'Fixed Assets', 'account_type': 'asset', 'description': 'Long-term tangible assets'},
    {'code': '1510', 'name': 'Accumulated Depreciation', 'account_type': 'asset', 'description': 'Contra-asset for fixed asset depreciation'},
    # Liabilities (2000s)
    {'code': '2000', 'name': 'Accounts Payable', 'account_type': 'liability', 'description': 'Money owed to suppliers'},
    {'code': '2100', 'name': 'Tax Payable', 'account_type': 'liability', 'description': 'VAT/GST/Sales tax collected and owed'},
    {'code': '2200', 'name': 'Accrued Liabilities', 'account_type': 'liability', 'description': 'Expenses incurred but not yet paid'},
    {'code': '2300', 'name': 'Deferred Revenue', 'account_type': 'liability', 'description': 'Customer deposits / advance payments'},
    {'code': '2400', 'name': 'Short-Term Loans', 'account_type': 'liability', 'description': 'Loans due within one year'},
    # Equity (3000s)
    {'code': '3000', 'name': 'Owner Equity', 'account_type': 'equity', 'description': 'Owners investment in the company'},
    {'code': '3100', 'name': 'Retained Earnings', 'account_type': 'equity', 'description': 'Cumulative earnings kept in the business'},
    # Revenue (4000s)
    {'code': '4000', 'name': 'Sales Revenue', 'account_type': 'revenue', 'description': 'Revenue from product sales'},
    {'code': '4100', 'name': 'Service Revenue', 'account_type': 'revenue', 'description': 'Revenue from services rendered'},
    {'code': '4200', 'name': 'Subscription Revenue', 'account_type': 'revenue', 'description': 'Recurring SaaS / retainer income'},
    {'code': '4900', 'name': 'Other Income', 'account_type': 'revenue', 'description': 'Miscellaneous income'},
    # Expenses (5000s)
    {'code': '5000', 'name': 'Cost of Goods Sold', 'account_type': 'expense', 'description': 'Direct cost of products sold'},
    {'code': '5100', 'name': 'Salaries & Wages', 'account_type': 'expense', 'description': 'Employee compensation'},
    {'code': '5200', 'name': 'Software & Subscriptions', 'account_type': 'expense', 'description': 'SaaS tools and licenses'},
    {'code': '5300', 'name': 'Office Supplies', 'account_type': 'expense', 'description': 'Stationery and office consumables'},
    {'code': '5400', 'name': 'Marketing & Advertising', 'account_type': 'expense', 'description': 'Paid ads, events, content'},
    {'code': '5500', 'name': 'Travel & Accommodation', 'account_type': 'expense', 'description': 'Business travel expenses'},
    {'code': '5600', 'name': 'Utilities', 'account_type': 'expense', 'description': 'Electricity, internet, phone'},
    {'code': '5700', 'name': 'Depreciation Expense', 'account_type': 'expense', 'description': 'Monthly fixed asset depreciation'},
    {'code': '5800', 'name': 'Hardware & Equipment', 'account_type': 'expense', 'description': 'Computer hardware, servers'},
    {'code': '5900', 'name': 'Other Expenses', 'account_type': 'expense', 'description': 'Miscellaneous operating expenses'},
]


class Command(BaseCommand):
    help = 'Seeds default Chart of Accounts for all existing tenants'

    def handle(self, *args, **kwargs):
        from apps.erp.models import Account
        try:
            from apps.core.models import Tenant
            tenants = Tenant.objects.all()
        except Exception:
            self.stdout.write(self.style.WARNING('Could not load Tenant model. Seeding for all existing Account tenants only.'))
            tenants = []

        if not tenants:
            self.stdout.write(self.style.WARNING('No tenants found. Create a tenant first, then re-run this command.'))
            return

        created_count = 0
        for tenant in tenants:
            for coa in DEFAULT_COA:
                _, created = Account.objects.get_or_create(
                    tenant=tenant,
                    code=coa['code'],
                    defaults={
                        'name': coa['name'],
                        'account_type': coa['account_type'],
                        'description': coa.get('description', ''),
                        'is_active': True,
                    }
                )
                if created:
                    created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Chart of Accounts seeded: {created_count} new accounts created across {tenants.count()} tenants.'
        ))
