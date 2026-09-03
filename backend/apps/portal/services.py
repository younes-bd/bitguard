from apps.crm.domain.models import Client
from apps.accounting.domain.models import Invoice
from apps.helpdesk.domain.models import Ticket
from apps.sale.domain.models import SaleOrder
from apps.projects.domain.models import Project
from apps.subscriptions.domain.models import ServiceContract, Subscription
from apps.maintenance.domain.models import Asset

class PortalDashboardService:
    @staticmethod
    def get_dashboard_data(user):
        client = Client.objects.filter(contacts__user=user).first()
        if not client:
            return None
            
        invoices = Invoice.objects.filter(client=client).order_by('-issue_date')
        tickets = Ticket.objects.filter(created_by=user).order_by('-created_at')
        orders = SaleOrder.objects.filter(client=client).order_by('-date_order')
        projects = Project.objects.filter(client=client).order_by('-created_at')
        contracts = ServiceContract.objects.filter(client=client).order_by('-start_date')
        subscriptions = Subscription.objects.filter(user=user).order_by('-created_at')
        assets = Asset.objects.filter(client=client).order_by('-created_at')
        
        return {
            'client': {'id': client.id, 'name': client.name},
            'counts': {
                'invoices': invoices.count(),
                'tickets': tickets.count(),
                'orders': orders.count(),
                'projects': projects.count(),
                'contracts': contracts.count(),
                'subscriptions': subscriptions.count(),
                'maintenance': assets.count(),
            },
            'open_invoices': invoices.filter(status='sent').count(),
            'open_tickets': tickets.filter(status='open').count(),
            'active_contracts': contracts.filter(status='active').count(),
            'recent_invoices': [{'id': i.id, 'number': str(i.invoice_number or i.id), 'amount': str(i.amount_total), 'status': i.status, 'date': str(i.issue_date)} for i in invoices[:5]],
            'recent_tickets': [{'id': t.id, 'subject': t.subject, 'status': t.status, 'date': str(t.created_at.date())} for t in tickets[:5]],
            'recent_orders': [{'id': o.id, 'number': str(o.order_number), 'amount': str(o.amount_total), 'status': o.status, 'date': str(o.date_order)} for o in orders[:5]],
            'recent_projects': [{'id': p.id, 'name': p.name, 'status': p.status} for p in projects[:5]],
        }
