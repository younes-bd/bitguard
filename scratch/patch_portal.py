import os
filepath = 'backend/apps/crm/api/views.py'
with open(filepath, 'r') as f:
    content = f.read()

portal_old = '''    @action(detail=True, methods=['get'], url_path='portal-summary')
    def portal_summary(self, request, pk=None):
        client = self.get_object()
        try:
            from apps.helpdesk.domain.models import Ticket
            from apps.accounting.domain.models import Invoice
            from apps.subscriptions.domain.models import ServiceContract
            from apps.maintenance.domain.models import Asset

            open_tickets = Ticket.objects.filter(client=client, status__in=['open', 'in_progress']).count()
            overdue_invoices = Invoice.objects.filter(client=client, status='overdue').count()
            active_contracts = ServiceContract.objects.filter(client=client, status='active').count()
            assigned_assets = Asset.objects.filter(client=client).count()'''

portal_new = '''    @action(detail=True, methods=['get'], url_path='portal-summary')
    def portal_summary(self, request, pk=None):
        from django.apps import apps
        client = self.get_object()
        try:
            open_tickets = 0
            if apps.is_installed('apps.helpdesk'):
                from apps.helpdesk.services import HelpdeskService
                open_tickets = HelpdeskService.get_open_tickets_for_client(client)
            
            overdue_invoices = 0
            if apps.is_installed('apps.accounting'):
                from apps.accounting.services import AccountingService
                overdue_invoices = AccountingService.get_overdue_invoices_for_client(client)
                
            active_contracts = 0
            if apps.is_installed('apps.subscriptions'):
                from apps.subscriptions.services import SubscriptionService
                active_contracts = SubscriptionService.get_active_contracts_for_client(client)
                
            assigned_assets = 0
            if apps.is_installed('apps.maintenance'):
                from apps.maintenance.services import MaintenanceService
                assigned_assets = MaintenanceService.get_assets_for_client(client)'''

content = content.replace(portal_old, portal_new)
with open(filepath, 'w') as f:
    f.write(content)
