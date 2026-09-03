import os
filepath = 'backend/apps/crm/api/views.py'
with open(filepath, 'r') as f:
    content = f.read()

import_statement = '''    @action(detail=True, methods=['get'], url_path='statement')
    def statement(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        from apps.accounting.domain.models import Invoice'''

new_statement = '''    @action(detail=True, methods=['get'], url_path='statement')
    def statement(self, request, pk=None):
        from django.apps import apps
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService'''

content = content.replace(import_statement, new_statement)

query_old = '''        invoices = Invoice.objects.filter(client=client).exclude(status__in=['paid', 'void', 'cancelled'])
        if period_start:
            invoices = invoices.filter(issue_date__gte=period_start)
        if period_end:
            invoices = invoices.filter(issue_date__lte=period_end)
            
        context = {
            'period_start': period_start,
            'period_end': period_end,
            'invoices': invoices.order_by('issue_date'),
        }'''

query_new = '''        invoices = []
        if apps.is_installed('apps.accounting'):
            from apps.accounting.services import AccountingService
            invoices = AccountingService.get_invoices_for_client(
                client, 
                status_exclude=['paid', 'void', 'cancelled'],
                period_start=period_start,
                period_end=period_end
            )
            invoices = invoices.order_by('issue_date')
            
        context = {
            'period_start': period_start,
            'period_end': period_end,
            'invoices': invoices,
        }'''
content = content.replace(query_old, query_new)

with open(filepath, 'w') as f:
    f.write(content)
