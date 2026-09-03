import os

BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')

# 1. Update Accounting Service
accounting_service = os.path.join(BACKEND_DIR, 'apps', 'accounting', 'services.py')
with open(accounting_service, 'a') as f:
    f.write('''

    @staticmethod
    def get_overdue_invoices_for_client(client):
        from .domain.models import Invoice
        return Invoice.objects.filter(client=client, status='overdue').count()

    @staticmethod
    def get_invoices_for_client(client, status_exclude=None, period_start=None, period_end=None):
        from .domain.models import Invoice
        invoices = Invoice.objects.filter(client=client)
        if status_exclude:
            invoices = invoices.exclude(status__in=status_exclude)
        if period_start:
            invoices = invoices.filter(issue_date__gte=period_start)
        if period_end:
            invoices = invoices.filter(issue_date__lte=period_end)
        return invoices
''')

# 2. Update Helpdesk Service
helpdesk_service = os.path.join(BACKEND_DIR, 'apps', 'helpdesk', 'services.py')
if not os.path.exists(helpdesk_service):
    with open(helpdesk_service, 'w') as f:
        f.write('class HelpdeskService:\n    pass\n')
        
with open(helpdesk_service, 'a') as f:
    f.write('''

    @staticmethod
    def get_open_tickets_for_client(client):
        from .domain.models import Ticket
        return Ticket.objects.filter(client=client, status__in=['open', 'in_progress']).count()
''')

# 3. Update Subscriptions Service
subscriptions_service = os.path.join(BACKEND_DIR, 'apps', 'subscriptions', 'services.py')
if not os.path.exists(subscriptions_service):
    with open(subscriptions_service, 'w') as f:
        f.write('class SubscriptionService:\n    pass\n')
with open(subscriptions_service, 'a') as f:
    f.write('''

    @staticmethod
    def get_active_contracts_for_client(client):
        from .domain.models import ServiceContract
        return ServiceContract.objects.filter(client=client, status='active').count()
''')

# 4. Update Maintenance Service
maintenance_service = os.path.join(BACKEND_DIR, 'apps', 'maintenance', 'services.py')
if not os.path.exists(maintenance_service):
    with open(maintenance_service, 'w') as f:
        f.write('class MaintenanceService:\n    pass\n')
with open(maintenance_service, 'a') as f:
    f.write('''

    @staticmethod
    def get_assets_for_client(client):
        from .domain.models import Asset
        return Asset.objects.filter(client=client).count()
''')

print('Services updated.')
