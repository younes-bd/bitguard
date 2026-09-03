

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
